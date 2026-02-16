// Types for KYC module
export interface KYCDocument {
    id: string;
    type: string;
    fileName: string;
    uploadedAt: Date;
    status: 'pending' | 'verified' | 'rejected';
}

export interface KYCVerification {
    id: string;
    customerId: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    documents: KYCDocument[];
    createdAt: Date;
    updatedAt: Date;
}
