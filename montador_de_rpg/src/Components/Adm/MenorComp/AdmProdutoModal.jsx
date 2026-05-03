import { Carousel } from 'react-responsive-carousel';
import styles from '../../Css/styles.AdmProdutoModal.module.css';
import axios from 'axios';

export default function AdmProdutoModal({produto, setViewProduct, setEditProduct}) {

  console.log (produto);

  const subcategories = Object.values(JSON.parse(localStorage.getItem("subcategories")));
  const categories = Object.values(JSON.parse(localStorage.getItem("categories")));
  const subcategory = subcategories.find((sub) => sub.id_categoria === produto.categoria);
  const categoryName = categories.find((cat) => cat.id_categoria === subcategory.sub_categoria_de).nome;


  function handleEditProduct() {
    setEditProduct(true);
    setViewProduct(false);
  }

  async function handleDeleteProduct() {
    try {
      await axios.delete(`/api/products/remove/${produto.id_prod}/`);
      alert(`Produto com id ${produto.id_prod} foi deletado com sucesso.`);
      setViewProduct(false);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={() => setViewProduct(false)}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <Carousel className={styles.carousel} showArrows={false} showThumbs={true} showStatus={false} swipeable={true} showIndicators={false}>
            <div className={styles.imagemC}>
                <img src={produto.imagem}/>
            </div>
            <div className={styles.imagemC}>
                <img src={produto.imagem}/>
            </div>
        </Carousel>
        <div>
          <h1> {produto.nome} </h1>
          <p> <b> {categoryName} • {subcategory.nome} </b> </p>
          <p> {produto.descricao} </p>
          <h2> R$ {produto.preco.toFixed(2).replace('.', ',')} </h2>

          <div className={styles.modalButtons}>
            <button className={styles.editButton} onClick={handleEditProduct}>
              <i class="ri-pencil-line"></i> Editar produto 
            </button>
            <button className={styles.deleteButton} onClick={() => handleDeleteProduct()}>
              <i class="ri-delete-bin-line"></i> Deletar produto
            </button>
          </div>
        </div>

        <button className={styles.modalClose} onClick={() => setViewProduct(false)}>
          <i class="ri-close-line"></i> 
        </button>
      </div>
    </div>
  )
}