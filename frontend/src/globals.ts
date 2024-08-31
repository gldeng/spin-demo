import { Spin, SpinGameInitArgs } from "spin";
import {Subject} from "rxjs";

const ZK_USER_ADDRESS = import.meta.env.VITE_ZK_CLOUD_USER_ADDRESS;
const ZK_USER_PRIVATE_KEY = import.meta.env.VITE_ZK_CLOUD_USER_PRIVATE_KEY;
const ZK_IMAGE_MD5 = import.meta.env.VITE_ZK_CLOUD_IMAGE_MD5;
const ZK_CLOUD_RPC_URL = import.meta.env.VITE_ZK_CLOUD_URL;

export const spin = new Spin({
    cloudCredentials: {
        CLOUD_RPC_URL: ZK_CLOUD_RPC_URL,
        USER_ADDRESS: ZK_USER_ADDRESS,
        USER_PRIVATE_KEY: ZK_USER_PRIVATE_KEY,
        IMAGE_HASH: ZK_IMAGE_MD5,
    },
});
export const gameStatus = {
    initialized: false
};

export interface GameStateOfNumberFormat {
    total_steps: number;
    current_position: number;
}

export const subMove = new Subject<number>();
export const subGameInit = new Subject<GameStateOfNumberFormat>();
export const subMoved = new Subject<number>();
subGameInit.subscribe(()=>{
    console.log('subGameInit');
})
