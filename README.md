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

- Centralização total das informações  
- Painel administrativo para Mestres  
- Interface imersiva para Jogadores  
- Integração com renderização 3D em tempo real  

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

<table>
  <tr>
    <td align="center" width="25%"><strong>Front-end</strong></td>
    <td align="center" width="25%"><strong>3D & Física</strong></td>
    <td align="center" width="25%"><strong>Validação & Forms</strong></td>
    <td align="center" width="25%"><strong>Back-end & Outros</strong></td>
  </tr>
  <tr>
    <td valign="top" align="center"><br>
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /><br><br>
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /><br><br>
      <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
    </td>
    <td valign="top" align="center"><br>
      <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /><br><br>
      <img src="https://img.shields.io/badge/R3F-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Three Fiber" /><br><br>
      <img src="https://img.shields.io/badge/Cannon.js-E1573D?style=for-the-badge&logo=box&logoColor=white" alt="Cannon.js" />
    </td>
    <td valign="top" align="center"><br>
      <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" /><br><br>
      <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
    </td>
    <td valign="top" align="center"><br>
      <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /><br><br>
      <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
    </td>
  </tr>
</table>

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
```

---

## Instalação e Execução

Este projeto é dividido em duas partes: Cliente (Front-end) e Servidor (Back-end/API).

### Pré-requisitos
* [Node.js](https://nodejs.org/) (v22+)

## Rodando o front-End

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Montador_de_RPG.git
cd barbalao

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```
