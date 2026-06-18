# React + Vite
<div align="center">
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
# 🗡️ Montador de RPG
Currently, two official plugins are available:
**Uma plataforma imersiva para criação, gerenciamento e vivência de aventuras épicas de RPG multijogador com elementos 3D no navegador.**
<div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/) [![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/) [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
</div>
## React Compiler
*Sugestão de Banner: Uma imagem mostrando uma interface de usuário temática (HUD) mesclada com uma visualização de mundo/tabuleiro 3D ao fundo, exibindo painéis de Jogador e Mestre de Jogo.*
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
</div>
## Expanding the ESLint configuration
<br>
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
## 📖 Sumário
- [Visão Geral](#-visão-geral)
- [Demonstração](#-demonstração)
- [O Propósito do Projeto](#-o-propósito-do-projeto)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura e Boas Práticas](#-arquitetura-e-boas-práticas)
- [UX / UI e Responsividade](#-ux--ui-e-responsividade)
- [Roadmap e Melhorias Futuras](#-roadmap-e-melhorias-futuras)
- [Contato](#-contato)
---
## 🌟 Visão Geral
O **Montador de RPG** é o front-end avançado de uma plataforma idealizada para revolucionar a forma como a comunidade de RPG de mesa interage com mundos virtuais. Mais do que um simples site ou painel, é uma ferramenta visual que permite a montagem de campanhas complexas, o gerenciamento de sessões e a imersão interativa dos jogadores.
Este projeto se destaca por integrar interfaces ricas, desenvolvidas em React moderno, com **elementos 3D renderizados em tempo real** através do ecossistema Three.js. Ele preenche a lacuna entre plataformas 2D tradicionais e a complexidade de motores de jogos completos, rodando de forma leve diretamente no navegador.
---
## 📸 Demonstração
*(Adicione aqui GIFs ou screenshots do projeto para que visitantes entendam rapidamente a magnitude visual do projeto)*
> **Dicas de Capturas:**
> - `![Painel do Mestre](link_para_imagem.png)`: Mostre a visão do Mestre de Jogo gerenciando atributos, validando dados ou criando campanhas.
> - `![Visualização 3D](link_para_gif.gif)`: Um GIF demonstrando o mundo e os modelos 3D renderizados pelo Three.js em funcionamento.
> - `![HUD do Jogador](link_para_imagem.png)`: A interface interativa e temática do jogador durante uma sessão de jogo.
---
## 🎯 O Propósito do Projeto
Jogadores e Mestres de RPG costumam usar múltiplas abas, softwares e planilhas para gerenciar uma única partida. O desafio técnico aqui foi: **Como unificar os dados complexos de uma sessão e o mundo imersivo de uma campanha em um único ambiente de navegador?**
Para resolver isso, o sistema foi desenhado com:
1. **Painéis Distintos:** Uma área isolada e segura para o **Admin** do sistema, ferramentas de alto controle para o **Mestre de Jogo**, e uma interface focada em gameplay para o **Jogador**.
2. **Ambiente Sem Fricção:** Utilizando rotas fluídas (React Router) e OAuth2, garantindo que usuários passem menos tempo configurando e mais tempo jogando.
3. **Imersão Visual:** A inclusão nativa de física e renderização 3D para mapas e dados sem a necessidade de downloads externos.
---
## ✨ Principais Funcionalidades
- **🎭 Hub de Perfis (Admin, Mestre e Jogador):** Interfaces inteiramente modulares e baseadas no nível de permissão (ex: `AdmPanel`, `MasterPanel`, `PlayerPanel`).
- **🧊 Motor 3D Integrado:** Renderização de ambientes interativos em tempo real usando `@react-three/fiber`, suportando até mesmo dinâmicas de física com `@react-three/cannon`.
- **🔐 Autenticação Segura e OAuth2:** Fluxos de login inteligentes para integração suave com provedores externos (`OAuth2Redirect.jsx`).
- **📝 Engine de Validação Complexa:** Tratamento robusto de formulários na criação de fichas e personagens usando a sinergia entre `React Hook Form` e `Zod`, evitando erros de usuário e chamadas redundantes ao servidor.
- **🖼️ Componentização Rica:** Apresentação dinâmica usando carrosséis responsivos e iconografia unificada para manter a temática de aventura sem perder a clareza de uso.
---
## 🛠️ Tecnologias Utilizadas
A stack foi escolhida de forma rigorosa para unir a alta performance gráfica que um jogo exige com as melhores práticas estruturais de UI corporativa:
### Front-end e Interatividade Visual
- **[React 19](https://react.dev/):** Biblioteca essencial para criar interfaces dinâmicas, reativas e componentizadas.
- **[Vite](https://vitejs.dev/):** Bundler extremamente veloz, garantindo performance de construção e carregamento otimizado.
- **[Three.js / React Three Fiber / Cannon]:** Motor de gráficos 3D e física para browsers, compondo o núcleo visual do tabuleiro ou ambiente do jogo.
- **[React Hook Form + Zod]:** Segurança de dados no front-end, garantindo que fichas de personagens e configurações obedeçam regras estritas antes de chegar ao back-end.
- **[React Router DOM]:** Navegação SPA (Single Page Application) fluída e segura, não interrompendo a sessão de jogo entre as mudanças de abas.
### Comunicação com Back-end
- **[Axios]:** Cliente HTTP para troca de estados, login, autenticação e sincronização do mundo com o servidor back-end.
---
## 🏗️ Arquitetura e Boas Práticas
O código foi estruturado pensando em escalabilidade e manutenção, podendo evoluir para um SaaS (Software as a Service) voltado para gamers:
- **Separação de Responsabilidades:** Componentes visuais puramente apresentacionais (`src/Components/`) são mantidos distantes da lógica pesada de telas (`src/pages/`).
- **Data-Fetching Seguro:** O tratamento de erros nas requisições é antecipado, com falhas visuais adequadas (Páginas de Erro) para não estragar a imersão.
- **Módulos Independentes:** As lógicas para cada tipo de perfil de usuário não interferem umas nas outras.
---
## 🎨 UX / UI e Responsividade
O maior desafio de design em sistemas de RPG é a densidade de informações.
- A aplicação utiliza o conceito de **Overlays Flutuantes**, garantindo que o mundo 3D seja sempre o protagonista visual.
- Cores e tipografia transmitem uma temática de aventura "AAA", usando painéis dinâmicos que dão *feedback* imediato (via toasts ou modais estilizados) a cada ação do Mestre ou Jogador.
- **Mobile First Híbrido:** Embora a exploração 3D ideal exija telas maiores, as áreas de gerenciamento (Painel de Usuário, Formulários de Criação) são 100% responsivas para celulares.
---
## 🗺️ Roadmap e Evolução do Produto
O projeto continua sendo aprimorado. O que vem a seguir?
- [ ] Implementação de **WebSockets** (Socket.io) para movimentação visual, chat e atualização de combates em milissegundos.
- [ ] Otimização profunda de performance 3D através de Lazy Loading de texturas no `react-three-fiber`.
- [ ] Novo construtor de mapas no estilo "Drag-and-Drop", simplificando ainda mais a vida do Mestre de Jogo.
---
## 💖 Contato
Desenvolvido com o objetivo de inovar a experiência do RPG online, utilizando as ferramentas web mais avançadas do mercado.
- **Portfólio / Site:** [seusite.com](https://seusite.com)
- **LinkedIn:** [linkedin.com/in/seuperfil](https://linkedin.com/in/seuperfil)
- **GitHub:** [@seuperfil](https://github.com/seuperfil)
- **Email para Contato:** contato@seudominio.com
*(Gostou do projeto ou quer conversar sobre as soluções técnicas utilizadas? Entre em contato!)*
