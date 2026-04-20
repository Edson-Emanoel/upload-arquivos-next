export type MockImage = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  sizeLabel: string;
  dimensions: string;
  accentFrom: string;
  accentTo: string;
};

export const mockImages: MockImage[] = [
  {
    id: "img-praia-dourada",
    title: "Praia dourada",
    description: "Foto de capa para a colecao de verao com foco em luz quente e horizonte limpo.",
    category: "Campanha",
    createdAt: "20/04/2026",
    sizeLabel: "2.4 MB",
    dimensions: "2400 x 1600",
    accentFrom: "#f59e0b",
    accentTo: "#fb7185",
  },
  {
    id: "img-cidade-noturna",
    title: "Cidade noturna",
    description: "Imagem urbana para banner principal com contraste forte e tons frios.",
    category: "Banner",
    createdAt: "18/04/2026",
    sizeLabel: "3.1 MB",
    dimensions: "2800 x 1800",
    accentFrom: "#0f172a",
    accentTo: "#2563eb",
  },
  {
    id: "img-produto-estudio",
    title: "Produto em estudio",
    description: "Material para vitrine digital com foco em composicao limpa e fundo neutro.",
    category: "E-commerce",
    createdAt: "15/04/2026",
    sizeLabel: "1.8 MB",
    dimensions: "2000 x 2000",
    accentFrom: "#475569",
    accentTo: "#e2e8f0",
  },
  {
    id: "img-folhagem-editorial",
    title: "Folhagem editorial",
    description: "Imagem de apoio para secao institucional com textura organica e leitura suave.",
    category: "Institucional",
    createdAt: "12/04/2026",
    sizeLabel: "2.0 MB",
    dimensions: "2200 x 1467",
    accentFrom: "#166534",
    accentTo: "#84cc16",
  },
];

export function getMockImageById(id: string) {
  return mockImages.find((image) => image.id === id) ?? null;
}
