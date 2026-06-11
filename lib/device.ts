import 'server-only';
import { cookies } from 'next/headers';

// Reads the device id minted by middleware. Returns undefined only on the very
// first request before the cookie round-trips back.
export async function getDeviceId(): Promise<string | undefined> {
    const c = await cookies();
    return c.get('device_id')?.value;
}
