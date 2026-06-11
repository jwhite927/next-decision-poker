import 'server-only';
import { supabaseAdmin } from './supabase';

export type Decision = {
    id: string;
    creator: string;
    prompt: string;
    revealed: boolean;
    round: number;
};

export async function saveDecision(input: {
    creator: string;
    prompt: string;
}): Promise<Decision> {
    const id = crypto.randomUUID();
    const { error } = await supabaseAdmin.from('decisions').insert({
        id,
        creator: input.creator,
        prompt: input.prompt,
    });

    if (error) {
        throw new Error(`Failed to save decision: ${error.message}`);
    }

    // revealed/round fall back to their DB defaults (false / 1).
    return { id, ...input, revealed: false, round: 1 };
}

export type Opinion = {
    id: string;
    author: string;
    opinion: string;
};

export async function getDecision(id: string): Promise<Decision | null> {
    const { data, error } = await supabaseAdmin
        .from('decisions')
        .select('id, creator, prompt, revealed, round')
        .eq('id', id)
        .maybeSingle();

    if (error) throw new Error(`Failed to load decision: ${error.message}`);
    return data;
}

export async function getOpinions(
    decisionId: string,
    round: number,
): Promise<Opinion[]> {
    const { data, error } = await supabaseAdmin
        .from('opinions')
        .select('id, author, opinion')
        .eq('decision_id', decisionId)
        .eq('round', round)
        .order('created_at', { ascending: true });

    if (error) throw new Error(`Failed to load opinions: ${error.message}`);
    return data ?? [];
}

export async function saveOpinion(input: {
    decisionId: string;
    author: string;
    opinion: string;
    round: number;
}): Promise<void> {
    const { error } = await supabaseAdmin.from('opinions').insert({
        decision_id: input.decisionId,
        author: input.author,
        opinion: input.opinion,
        round: input.round,
    });

    if (error) throw new Error(`Failed to save opinion: ${error.message}`);
}

export async function revealDecision(id: string): Promise<void> {
    const { error } = await supabaseAdmin
        .from('decisions')
        .update({ revealed: true })
        .eq('id', id);
    if (error) throw new Error(`Failed to reveal: ${error.message}`);
}

export async function startNextRound(
    id: string,
    currentRound: number,
): Promise<void> {
    const { error } = await supabaseAdmin
        .from('decisions')
        .update({ revealed: false, round: currentRound + 1 })
        .eq('id', id);
    if (error) throw new Error(`Failed to start next round: ${error.message}`);
}

export type RecentDecision = {
    id: string;
    prompt: string;
    round: number;
    revealed: boolean;
    lastSeen: string;
};

// Records (or refreshes) the link between a device and a decision. Called when a
// device creates or visits a decision; the upsert bumps last_seen on revisits.
export async function recordDeviceDecision(
    deviceId: string,
    decisionId: string,
): Promise<void> {
    const { error } = await supabaseAdmin.from('device_decisions').upsert(
        {
            device_id: deviceId,
            decision_id: decisionId,
            last_seen: new Date().toISOString(),
        },
        { onConflict: 'device_id,decision_id' },
    );

    if (error) {
        throw new Error(`Failed to record device decision: ${error.message}`);
    }
}

export async function getRecentDecisions(
    deviceId: string,
    limit = 10,
): Promise<RecentDecision[]> {
    const { data, error } = await supabaseAdmin
        .from('device_decisions')
        .select('last_seen, decisions(id, prompt, round, revealed)')
        .eq('device_id', deviceId)
        .order('last_seen', { ascending: false })
        .limit(limit);

    if (error) {
        throw new Error(`Failed to load recent decisions: ${error.message}`);
    }

    // supabase-js types the embedded relation loosely without generated types.
    return ((data ?? []) as unknown as RecentRow[]).map((row) => ({
        id: row.decisions.id,
        prompt: row.decisions.prompt,
        round: row.decisions.round,
        revealed: row.decisions.revealed,
        lastSeen: row.last_seen,
    }));
}

type RecentRow = {
    last_seen: string;
    decisions: {
        id: string;
        prompt: string;
        round: number;
        revealed: boolean;
    };
};
