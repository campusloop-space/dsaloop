import type { AuthConfig } from "@auth/core";

export const authConfig: AuthConfig = {
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET || "2b3b27e73069fb419899e9513e9a9c8d537fa6b62f4167fe684d8bbc6044472b",
  trustHost: true,
  providers: [
    {
      id: "campusloop",
      name: "CampusLoop",
      type: "oidc",
      issuer: process.env.CAMPUSLOOP_ISSUER || "https://campusloop.space",
      clientId:
        process.env.CAMPUSLOOP_CLIENT_ID ||
        process.env.CLIENT_ID ||
        "cl_app_28oQTDf7rC7ocJbW",
      clientSecret:
        process.env.CAMPUSLOOP_CLIENT_SECRET ||
        process.env.CLIENT_SECRET ||
        "cl_secret_At2SAuM2tymdDtP0uPZ3x7zuhjtB-pCBLWS3468ATMU",
      authorization: {
        params: {
          scope: "openid profile email student college academic",
        },
      },
      checks: ["pkce", "state", "nonce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || (profile as any).preferred_username,
          email: profile.email,
          image: (profile as any).picture,
          studentVerified: (profile as any).student_verified === true,
          college:
            typeof (profile as any).college === "object"
              ? (profile as any).college?.name
              : (profile as any).college,
        };
      },
    },
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.studentVerified = (profile as any).student_verified === true;
        token.college =
          typeof (profile as any).college === "object"
            ? (profile as any).college?.name
            : (profile as any).college ?? null;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          studentVerified: token.studentVerified,
          college: token.college,
        },
      };
    },
  },
};
