import styles from '../../Css/styles.AdmProdutoCard.module.css';

export default function AdmProdutoCard({produto, setViewProduct, setBackdrop, setSelectedProduct}) {

    return(
        <div className={styles.productCard} onClick={() => {
          setViewProduct(true);
          setBackdrop(true);
          setSelectedProduct(produto);
        }}>
          <div className={styles.productImg}>
            <img
                src={produto.imagem || 'https://via.placeholder.com/150'}
                alt={produto.nome || 'Produto sem nome'}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
            />
          </div>
          <div className={styles.productInfo}>
            <h4 className={styles.info}>{produto.nome}</h4>
            <ul className={`${styles.productStars} ${styles.info}`}></ul>
            <h4 className={`${styles.priceWithDescount} ${styles.info}`}>
                R${' '}
                {parseFloat(produto.preco || 0)
                .toFixed(2)
                .replace('.', ',')}
            </h4>
            <i className={`ri-pencil-fill ${styles.shopIcon}`}></i>
          </div>
        </div>
    )
}