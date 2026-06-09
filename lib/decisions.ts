import "server-only";
import { supabaseAdmin } from "./supabase";

export type Decision = {
    id: string;
    creator: string;
    prompt: string;
};

export async function saveDecision(
    input: Omit<Decision, "id">
    ): Promise<Decision> {
        const id = crypto.randomUUID();
        const { error } = await supabaseAdmin.from("decisions").insert({
            id,
            creator: input.creator,
            prompt: input.prompt,
        });

        if (error) {
            throw new Error(`Failed to save decision: ${error.message}`);
        }

        return { id, ...input };
    }
