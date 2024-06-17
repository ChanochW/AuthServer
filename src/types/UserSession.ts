import {UserTemplate} from "./UserTemplate";

export interface UserSession {
    userId: string;
    accessToken: string;
    sessionViaRefresh: boolean;
}