import GraphCanvas from '@/components/graph/GraphCanvas';
import LoginModal from '@/components/team/LoginModal';

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <LoginModal />
      <GraphCanvas />
    </main>
  );
}
