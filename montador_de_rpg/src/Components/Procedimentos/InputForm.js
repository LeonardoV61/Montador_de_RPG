function InputForm({ prompt, onResponder }) {
  const [valor, setValor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const resposta = {};
    resposta[prompt.salvar_em] = valor;
    onResponder(resposta);
  };


  if (prompt?.opcoes_estatico?.length > 0) {
    return (
      <form onSubmit={handleSubmit}>
        <select value={valor} onChange={(e) => setValor(e.target.value)}>
          {prompt.opcoes_estatico.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
        <button type="submit">Enviar</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={valor} onChange={(e) => setValor(e.target.value)} />
      <button type="submit">Enviar</button>
    </form>
  );
}