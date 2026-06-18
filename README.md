# Montador de RPG - Plataforma Web Imersiva

> Plataforma web visual e interativa que permite a criação e gerenciamento de campanhas de RPG de mesa, unindo a gestão de sessões a um ambiente 3D imersivo para jogadores e Mestres de Jogo.



[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) 
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/) 
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/) 
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) 


---

## Sobre o Projeto

O *Montador de RPG* surgiu para resolver um problema clássico na comunidade de RPG de mesa virtual: a **fragmentação de ferramentas**.

Hoje, jogadores e mestres frequentemente utilizam várias abas e aplicativos para:

- Gerenciar fichas  
- Controlar sessões  
- Renderizar mapas  
- Organizar regras  

### A solução

- ✅ Centralização total das informações  
- ✅ Painel administrativo para Mestres  
- ✅ Interface imersiva para Jogadores  
- ✅ Integração com renderização 3D em tempo real  

---

## Funcionalidades

### Para o Jogador

- **Experiência 3D:** mapas e cenários renderizados no navegador  
- **HUD imersivo:** interface limpa e não intrusiva  
- **Gestão de ficha:** formulários inteligentes com validação  

### Para o Mestre / Admin

- **Controle de acesso por nível**
- **Criação de campanhas e mundos**
- **Login seguro com OAuth2**

---

## Tecnologias Utilizadas

### Front-end
- React  
- Vite  
- React Router  

### 3D e Física
- Three.js  
- React Three Fiber  
- Cannon  

### Validação e Forms
- React Hook Form  
- Zod  

### Comunicação
- Axios  

### Back-end (integração)
- Node.js  

---

## Screenshots

| Tela Inicial | HUD do Jogador | Visualização 3D |
|-------------|----------------|-----------------|
| ![](./public/Home.png) | ![](./public/PlayerHUD.png) | ![](./public/3DView.png) |

| Login | Painel do Mestre | Criação de Personagem | Mundo |
|------|----------------|----------------------|--------|
| ![](./public/Login.png) | ![](./public/MasterPanel.png) | ![](./public/CharacterForm.png) | ![](./public/WorldSettings.png) |

> ⚠️ Certifique-se de que as imagens estejam na pasta `public/`

---

## Estrutura do Projeto

```plaintext
montador_de_rpg/
├── public/
├── src/
│   ├── assets/
│   ├── Components/
│   ├── pages/
│   ├── Routes/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
