import 'server-only';
import { supabaseAdmin } from './supabase';

export type Decision = {
    id: string;
    creator: string;
    prompt: string;
    revealed: boolean;
    round: number;
};

export async function saveDecision(
    input: Omit<Decision, 'id'>,
): Promise<Decision> {
    const id = crypto.randomUUID();
    const { error } = await supabaseAdmin.from('decisions').insert({
        id,
        creator: input.creator,
        prompt: input.prompt,
    });

    if (error) {
        throw new Error(`Failed to save decision: ${error.message}`);
    }

    return { id, ...input };
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
