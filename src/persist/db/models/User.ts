import mongoose, { Document, Schema } from 'mongoose';
import {AddressTemplate} from "../../../types/AddressTemplate";
import {PaymentDetails, PaymentMethodTemplate, PaymentType} from "../../../types/PaymentMethodTemplate";
import {RoleTemplate} from "../../../types/RoleTemplate";
import {NameTemplate} from "../../../types/NameTemplate";
import {UserTemplate} from "../../../types/UserTemplate";

// Define sub-schemas for nested objects
const AddressSchema = new Schema<AddressTemplate>({
    streetAddress: { type: String, required: true },
    streetAddressSecondary: String,
    city: String,
    state: String,
    zip: Number,
}, { _id: false });

const PaymentDetailsSchema = new Schema<PaymentDetails>({
    cardNumber: String,
    expiryDate: Date,
    cvv: String,
    bankAccountNumber: String,
    routingNumber: String,
    paypalEmail: String,
    cryptoAddress: String,
    walletId: String,
    walletProvider: String,
}, { _id: false });


const PaymentMethodSchema = new Schema<PaymentMethodTemplate>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    name: String,
    description: String,
    details: PaymentDetailsSchema,
}, { _id: false });

const RoleSchema = new Schema({
    type: { type: String, enum: Object.values(RoleTemplate), required: true }
}, { _id: false });

const NameSchema = new Schema<NameTemplate>({
    prefix: String,
    firstName: String,
    middleName: String,
    lastName: String,
    suffix: String,
}, { _id: false });

// Define the main User schema
const UserSchema = new Schema<UserTemplate>({
    username: { type: String, required: true, unique: true },
    email: String,
    name: NameSchema,
    passwordHash: { type: String, required: true },
    primaryAddress: AddressSchema,
    otherAddresses: [AddressSchema],
    paymentMethods: [PaymentMethodSchema],
    role: { type: String, enum: Object.values(RoleTemplate), required: true },
}, { timestamps: true });

UserSchema.virtual('id').get(function(this: any) {
    return this._id.toHexString();
});

interface UserDocument extends UserTemplate, Document {}

export const UserModel = mongoose.model('User', UserSchema);