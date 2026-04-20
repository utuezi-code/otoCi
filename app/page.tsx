import InscriptionForm from './components/InscriptionForm';
import CarBackground from './components/CarBackground';

export default function Home() {
  return (
    <>
      <CarBackground />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <InscriptionForm />
      </div>
    </>
  );
}
