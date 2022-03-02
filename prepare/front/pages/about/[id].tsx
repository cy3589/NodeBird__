import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../components/AppLayout';

const User = () => {
  const router = useRouter();
  const id = router.query?.id;
  return (
    <AppLayout>
      <Head>
        <title>{id}</title>
      </Head>
    </AppLayout>
  );
};
export default User;
