# Sistema de Cálculo de Arquétipos

## Estrutura Implementada

### 1. **archetypes.ts** - Definição dos Arquétipos
- Define 12 arquétipos diferentes com suas características
- Mapeia quais perguntas contribuem para cada arquétipo
- Fornece cores únicas para cada um

### 2. **Cálculo de Pontuação**
```
Para cada arquétipo:
- Busca as 6 perguntas associadas
- Extrai a nota (1-5) de cada resposta
- Soma as 6 notas (máximo = 30 pontos)
- Calcula percentagem: (score / 30) * 100
```

### 3. **ResultScreen.tsx** - Tela de Resultados
Mostra:
- **Arquétipo Dominante** (1º lugar) - Card destacado com 🏆
- **Arquétipo Secundário** (2º lugar) - Card menor com ⭐
- **Arquétipo Terciário** (3º lugar) - Card compacto com ✨
- **Gráfico de todos os 12 arquétipos** com barras de progresso
- **Interpretação** do resultado
- **Botões** para baixar resultado em TXT ou refazer o teste

### 4. **Fluxo Completo**
```
1. Dados Pessoais (3 perguntas)
   ↓
2. 72 Perguntas de Arquétipo (com navegação rápida por teclas 1-5)
   ↓
3. ResultScreen (mostra os 12 arquétipos com scores)
   ↓
4. Opções: Baixar ou Refazer
```

## Features Principais

✅ **Persistência Local** - O progresso é salvo automaticamente no localStorage
✅ **Navegação Rápida** - Teclas 1-5 para responder questões Likert
✅ **Validação Zod** - Dados pessoais validados com formato correto
✅ **Máscara de Telefone** - WhatsApp formatado automaticamente
✅ **Barra de Progresso** - Visual da posição no teste
✅ **Transições Suaves** - Animações ao navegar entre questões
✅ **Design Responsivo** - Funciona em mobile, tablet e desktop
✅ **Download de Resultados** - Exporta resultado em arquivo TXT

## Exemplo de Uso

```typescript
// Calcular scores
const scores = calculateArchetypeScores(answers);

// Pegar top 3
const topThree = getTopArchetypes(scores, 3);

// Acessar resultado dominante
const dominant = topThree[0];
console.log(dominant.archetype.name); // "Inocente"
console.log(dominant.score); // 25
console.log(dominant.percentage); // 83.33
```

## Cores dos Arquétipos

- 🟡 **Inocente**: #FFD700 (Ouro)
- 🔵 **Órfão**: #87CEEB (Azul céu)
- 🔴 **Guerreiro**: #FF6347 (Tomate)
- 💗 **Caridoso**: #FF69B4 (Rosa Hot)
- 💚 **Explorador**: #32CD32 (Lima)
- 💕 **Amante**: #FF1493 (Rosa Profundo)
- 💜 **Fora da Lei**: #9932CC (Roxo Escuro)
- 🟠 **Criador**: #FF8C00 (Laranja Escuro)
- 🔷 **Mago**: #4169E1 (Azul Real)
- 🟠 **Governante**: #DAA520 (Goldenrod)
- ⚪ **Sábio**: #A9A9A9 (Cinza Escuro)
- 🔷 **Bobo**: #00CED1 (Turquesa Escuro)

## Próximas Melhorias

- [ ] Integração com backend para salvar resultados
- [ ] Dashboard com histórico de testes
- [ ] Exportar em PDF com mais informações
- [ ] Compartilhar resultado em redes sociais
- [ ] Adicionar recomendações baseadas no resultado
