export enum Status {
    ACTIVE = `active`,
    INACTIVE = `inactive`,
}

export interface OrganizationContactInfo {
    phone: string;
}

export interface OrganizationConnectionNode {
    id: string;
    name: string;
    owners: {
        email: string;
        id?: string;
    }[];
    contactInfo: OrganizationContactInfo;
    branding: {
        iconImageURL: string;
        primaryColor: string;
    };
}

export interface RolesConnectionEdge {
    node: RolesConnectionNode;
}

export interface RolesConnectionNode {
    id?: string;
    name?: string;
    status?: Status;
}

export interface RolesConnection {
    totalCount?: number;
    pageInfo?: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
    edges: RolesConnectionEdge[];
}

export interface OrganizationMembershipConnectionNode {
    userId?: string;
    organizationId?: string;
    id?: string;
    status?: Status;
    shortCode?: string;
    joinTimestamp?: string;
    organization?: OrganizationConnectionNode;
    rolesConnection?: RolesConnection;
}
