import ClientProvider from "@/components/ClientProvider";
import Home from "@/components/Home";
import { GQL_GET_HOME_PAGE } from "@/query/query";
import fetchGraphQL from "@/server/fetchGraphQL";
import getClientProviderProps from "@/server/getClientProviderProps";

export default async function HomePage() {
  const { fallback, session } = await getClientProviderProps((session) => {
    return [
      fetchGraphQL({
        query: GQL_GET_HOME_PAGE,
      }),
    ];
  });
  return (
    <ClientProvider fallback={fallback} session={session}>
      <main>
        <Home />
      </main>
    </ClientProvider>
  );
}
