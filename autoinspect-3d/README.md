# AutoInspect 3D — protótipo inicial

Protótipo de inspeção veicular com peças selecionáveis, registro de avarias e estimativa de serviços.

## Estado atual

- Visualização 3D procedural simplificada, inspirada em um hatch compacto.
- Rotação, zoom e navegação com React Three Fiber / Drei.
- Seleção de peças individuais por clique.
- Destaque visual para peça selecionada e peças com avarias.
- Registro de tipo, gravidade, serviço e observações.
- Cálculo demonstrativo de valores e total da inspeção.
- Lista de peças e registros removíveis.
- Layout adaptável para desktop e dispositivos móveis.

> **Importante:** o veículo exibido é uma geometria demonstrativa, não um modelo CAD/OEM ou uma digitalização fiel do Volkswagen Gol 2022. Não usar para laudo técnico, medição ou avaliação real. Os preços são valores fictícios de demonstração. Os dados ainda ficam apenas no estado da página e são perdidos ao recarregar.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Executar

```bash
cd autoinspect-3d
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente http://localhost:5173).

## Build de produção

```bash
npm run build
npm run preview
```

## Base técnica

A implementação usa React + Vite + TypeScript? Não: React em JavaScript, Three.js, @react-three/fiber e @react-three/drei. O repositório de referência para interações com peças é https://github.com/philorien/r3f-configurator. O projeto de referência não foi copiado integralmente nem alterado.

## Próximas etapas

1. Substituir a geometria provisória por um modelo 3D licenciado do Volkswagen Gol 2022.
2. Garantir nomes/IDs consistentes por malha: capô, para-choques, portas, paralamas, teto, vidros, rodas e lanternas.
3. Criar uma camada de normalização para modelos de diferentes fornecedores.
4. Persistir veículos, inspeções, peças e preços no banco.
5. Gerar orçamento PDF e fluxo de envio ao cliente.
6. Adicionar autenticação e isolamento de dados por oficina.

## Convenção recomendada para peças

Use IDs estáveis como `hood`, `front_bumper`, `door_front_left`, `door_front_right`, `roof`, `trunk` e `wheel_front_left`. O catálogo deve mapear nomes/aliases de cada GLB para esses IDs normalizados.
