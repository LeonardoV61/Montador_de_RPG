import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import styles from '../../Css/styles.AdmEditProductModal.module.css';

export default function AdmEditProductModal({ setEditProduct, produto }) {

  function makeProductSchema(product) {
    return z.object({
      name: z.preprocess(
        (val) => val === "" ? undefined : val,
        z.string()
          .min(3, "O nome deve ter pelo menos 3 caracteres")
          .max(100, "O nome pode ter no máximo 100 caracteres")
          .optional()
      ),

      price: z.preprocess(
        (val) => val === "" ? undefined : val,
        z.preprocess(
          (val) => typeof val === "string" ? val.replace(",", ".") : val,
          z.string()
            .regex(/^\d+(\.\d{1,2})?$/, "O preço deve ser um número válido")
            .transform((val) => Number(val))
            .refine((num) => num > 0, "O preço deve ser maior que zero")
            .optional()
        )
      ),

      description: z.preprocess(
        (val) => val === "" ? undefined : val,
        z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").optional()
      ),

      image: z.any()
          .optional()
          .transform((val) => {
            if (!val || (val instanceof FileList && val.length === 0)) {
              return undefined;
            }
            if (val instanceof FileList) {
              return val[0];
            }
            return val;
          })
          .refine(
            (file) => {
              if (!file) return true;
              return file instanceof File;
            },
            { message: "Arquivo inválido" }
          )
          .refine(
            (file) => {
              if (!file) return true; 
              return file.size < 5 * 1024 * 1024;
            },
            { message: "Máximo 5MB" }
          ),

      category: z.string(),
    }).superRefine((data, ctx) => {

      const fieldsToCheck = ["name", "price", "description", "image"];

      const hasChangedOtherField = fieldsToCheck.some((field) => {
        const newValue = data[field];
        const originalValue = product[field];

        if (typeof newValue === "string" && newValue.trim() === "") {
          return false;
        }

        if (newValue === undefined) return false;

        return newValue !== originalValue;
      });

      const categoryChanged = data.category !== product.category;

      if (!hasChangedOtherField && !categoryChanged) {
        ctx.addIssue({
          code: "custom",
          message: "Nenhum campo foi alterado.",
          path: ["_form"],
        });
      }
    });
  }

  async function postEdition(payload) {
    fetch(`https://back-end-barbalao.onrender.com/api/products/atualizar/${produto.id_prod}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || 'Falha ao editar produto');
          });
        }
        return res.json();
      })
      .then((json) => {
        alert(`Produto editado (id: ${json.ID})`)
        e.target.reset()
      })
      .catch((err) => {
        alert(`Erro: ${err.message}`);
      })
  }

  function getPayload(data) {

    const payload = {};

    const renameMap = {
        name: "nome_prod",
        price: "preco_prod",
        description: "descricao_prod",
        image: "imagem_prod",
        category: "categoria_id_categoria"
    }

    for (const key in data) {
      if (data[key]) {
        if (key === "category") {
          payload.categoria_id_categoria = Number(data.category);
        }
        const newKey = renameMap[key];
        payload[newKey] = data[key];
      };
    }

    return payload;
  }

  const subcategories = Object.values(JSON.parse(localStorage.getItem("subcategories")));
  const subcategoryId = subcategories.find((sub) => sub.id_categoria === produto.categoria).sub_categoria_de;
  const categories = subcategories.filter((sub) => sub.sub_categoria_de === subcategoryId);

  const productCategory = categories.find((product) => product.id_categoria === produto.categoria);

  const formattedProduct = {
    name: produto.nome,
    price: produto.preco,
    description: produto.descricao,
    image: produto.imagem,
    category: productCategory.nome,
  }
  
  const schema = makeProductSchema(formattedProduct)

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const allErrors = Object.values(form.formState.errors)
    .map((err) => err?.message)
    .filter(Boolean); // remove undefined

  async function handleSubmit(data) {
    
    if (data.image) {
      const leitor = new FileReader()
      leitor.onload = (ev) => {
        data.image = ev.target.result
        const payload = getPayload(data);
        postEdition(payload);

      }
      leitor.readAsDataURL(data.image)
    } else {
      const payload = getPayload(data);
      postEdition(payload);
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={() => setEditProduct(false)}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h1> Editar produto </h1>
            <p> Preencha apenas os campos que deseja alterar.</p>
            {allErrors.length > 0 && (
              <p>
                {allErrors.join(" • ")}
              </p>
            )}
            <div className={styles.form}>
              <div>
                <label htmlFor="editProdName"> Nome: </label>
                <input type="text" name="editProdName" id="editProdName" {...form.register("name")} />
              </div>
              <div>
                <label htmlFor="editProdPrice"> Preço: </label>
                <input type="text" name="editProdPrice" id="editProdPrice"
                  onInput={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    v = (v / 100).toFixed(2) + "";
                    v = v.replace(".", ",");
                    e.target.value = v;
                  }}
                  {...form.register("price")} />
              </div>
              <div>
                <label htmlFor="editProdDescription"> Descrição: </label>
                <textarea rows="4" name="editProdDescription" id="editProdDescription" {...form.register("description")} />
              </div>
              <div>
                <label> Imagem: </label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    accept="image/*"
                    {...form.register("image")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="editProdImg"> Categoria: </label>
                <div className={styles.selectWrapper}>
                  <select value={produto.categoria} {...form.register("category")}>
                    {categories.map((cat) => <option key={cat.id_categoria} value={cat.id_categoria}> {cat.nome} </option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalButtons}>
              <button type="submit" className={styles.editButton} >
                Confirmar
              </button>
              <button onClick={() => setEditProduct(false)} className={styles.deleteButton}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <button className={styles.modalClose} onClick={() => setEditProduct(false)}>
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>
  )
}