import {AddressTemplate} from "./AddressTemplate";
import {PaymentMethodTemplate} from "./PaymentMethodTemplate";
import {RoleTemplate} from "./RoleTemplate";
import {NameTemplate} from "./NameTemplate";

export interface UserTemplate {
    username: string;
    email?: string;
    name?: NameTemplate;
    passwordHash: string;
    primaryAddress?: AddressTemplate;
    otherAddresses?: AddressTemplate[];
    paymentMethods?: PaymentMethodTemplate[];
    role?: RoleTemplate;
}

export const getKeys = <T>() => (Object.keys({} as T) as Array<keyof T>);
