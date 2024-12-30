import { OrganizationMembershipConnectionNode } from "./types";
import {
    atom,
    selector,
} from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const organizationMembershipStackState = atom<OrganizationMembershipConnectionNode[]>({
    key: `organizationStackState`,
    default: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

export const currentOrganizationMembershipState = selector({
    key: `currentOrganizationMembershipState`,
    get: ({ get }) => {
        const memberships = get(organizationMembershipStackState);
        if (!memberships.length) return;
        return memberships[0];
    },
});

export const currentOrganizationState = selector({
    key: `currentOrganizationState`,
    get: ({ get }) => {
        const memberships = get(organizationMembershipStackState);
        return memberships[0]?.organization;
    },
});
