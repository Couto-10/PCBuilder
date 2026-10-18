# 🖥️ PC BUILDER

Projeto desenvolvido para uma competição de desenvolvimento web realizada pela **PROZ**, com o objetivo de aplicar conhecimentos de **HTML, CSS e JavaScript** na criação de uma aplicação web interativa.

O **PC Builder** tem como proposta ajudar pessoas iniciantes a escolher os componentes para montar seu primeiro computador, considerando a compatibilidade entre as peças e o orçamento disponível.

---

## 🚀 Teste o projeto

Acesse a versão publicada:

👉 https://couto-10.github.io/PCBuilder/

---

## 📸 Sobre o projeto

### Fase 1 — Estrutura e funcionalidades iniciais

Na primeira fase, os componentes são declarados diretamente no HTML e manipulados pelo JavaScript por meio do DOM.

Essa versão implementa a seleção de componentes, algumas verificações de compatibilidade, a atualização do preço total e a validação da montagem antes de sua finalização.

### Fase 2 — Integração com JSON

A próxima fase tem como objetivo utilizar o **JSON** para armazenar os dados dos componentes, como nomes, preços, categorias e especificações técnicas.

O JavaScript será responsável por ler esses dados e gerar os cards dinamicamente, mantendo o HTML como estrutura da página e facilitando a manutenção e a expansão do catálogo.

---

## ⚙️ Funcionalidades atuais

- Seleção de componentes por categoria.
- Verificação de compatibilidade entre o socket do processador e o da placa-mãe.
- Comparação entre a potência da fonte e o consumo estimado dos componentes.
- Atualização do preço total conforme as escolhas do usuário.
- Verificação de que todas as categorias necessárias foram preenchidas antes de finalizar a montagem.

> **Observação:** as verificações de compatibilidade são limitadas às regras implementadas nesta versão e não representam uma validação completa de todos os aspectos técnicos de um computador.

---

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- JSON — previsto para a segunda fase do projeto.

---

## 🔮 Próximas melhorias

- Integrar o catálogo de componentes com arquivos JSON.
- Gerar os cards de componentes dinamicamente com JavaScript.
- Melhorar a experiência e a interface do usuário (UX/UI), tornando a montagem mais intuitiva para iniciantes.
- Adicionar botões de ajuda e explicações sobre os componentes, facilitando a compreensão das especificações técnicas.
