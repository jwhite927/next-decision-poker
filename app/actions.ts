'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { forgetDevice } from '@/lib/decisions';

const DEVICE_COOKIE = 'device_id';

// Consent opt-in: mint a device id only when the user explicitly asks us to
// remember their decisions on this device. The act of clicking is the consent.
export async function enableDeviceMemory() {
    const c = await cookies();
    if (!c.get(DEVICE_COOKIE)) {
        c.set(DEVICE_COOKIE, crypto.randomUUID(), {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        });
    }
    revalidatePath('/');
}

// Consent revoke: delete the stored history and drop the cookie.
export async function disableDeviceMemory() {
    const c = await cookies();
    const id = c.get(DEVICE_COOKIE)?.value;
    if (id) {
        await forgetDevice(id);
        c.delete(DEVICE_COOKIE);
    }
    revalidatePath('/');
}
