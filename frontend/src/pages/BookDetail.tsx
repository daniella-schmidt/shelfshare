import { useParams } from 'react-router-dom';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Detalhes do Livro</h1>
      <p>ID: {id}</p>
      {/* Aqui você buscará os dados da API */}
    </div>
  );
}