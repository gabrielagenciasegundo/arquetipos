"use client";

import { Mail, RotateCcw, StickyNote } from "lucide-react";
import { Button } from "./ui/button";
import { ArchetypeScore, getTopArchetypes } from "./utils/archetypes";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface ResultScreenProps {
  scores: ArchetypeScore[];
  personalData: {
    nome: string;
    email: string;
    Whatsapp: string;
  };
  onRestart: () => void;
}

export default function ResultScreen({
  scores,
  personalData,
  onRestart,
}: ResultScreenProps) {
  const topThree = getTopArchetypes(scores, 3);
  const dominant = topThree[0];
  const secondary = topThree[1];
  const tertiary = topThree[2];

  const handleDownload = async () => {
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 48;
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const colorPrimary = rgb(0.18, 0.23, 0.17);
    const colorSecondary = rgb(0.35, 0.43, 0.31);
    const colorMuted = rgb(0.42, 0.45, 0.38);

    const wrapText = (text: string, font: typeof regularFont, size: number, maxWidth: number) => {
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      words.forEach((word) => {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, size) <= maxWidth) {
          line = test;
        } else {
          if (line) lines.push(line);
          line = word;
        }
      });
      if (line) lines.push(line);
      return lines;
    };

    let cursorY = pageHeight - margin;
    const contentWidth = pageWidth - margin * 2;

    const ensureSpace = (needed: number) => {
      if (cursorY - needed < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        cursorY = pageHeight - margin;
      }
    };

    try {
      const logoBytes = await fetch("/agencia-segundo_cut.png").then((r) => r.arrayBuffer());
      const logo = await pdfDoc.embedPng(logoBytes);
      const logoWidth = 140;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      page.drawImage(logo, {
        x: margin,
        y: cursorY - logoHeight,
        width: logoWidth,
        height: logoHeight,
      });
      cursorY -= logoHeight + 18;
    } catch {
      // Se o logo falhar, segue sem ele.
    }

    page.drawText("Resultado do Teste de Arquétipos", {
      x: margin,
      y: cursorY,
      size: 20,
      font: boldFont,
      color: colorPrimary,
    });
    cursorY -= 18;
    page.drawText(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
      x: margin,
      y: cursorY,
      size: 10,
      font: regularFont,
      color: colorMuted,
    });
    cursorY -= 22;

    page.drawRectangle({
      x: margin,
      y: cursorY - 10,
      width: contentWidth,
      height: 1,
      color: colorSecondary,
    });
    cursorY -= 24;

    const drawSectionTitle = (title: string) => {
      ensureSpace(22);
      page.drawText(title, {
        x: margin,
        y: cursorY,
        size: 14,
        font: boldFont,
        color: colorPrimary,
      });
      cursorY -= 18;
    };

    const drawParagraph = (text: string, size = 11) => {
      const lines = wrapText(text, regularFont, size, contentWidth);
      ensureSpace(lines.length * (size + 3));
      lines.forEach((line) => {
        page.drawText(line, { x: margin, y: cursorY, size, font: regularFont, color: rgb(0, 0, 0) });
        cursorY -= size + 3;
      });
      cursorY -= 6;
    };

    drawSectionTitle("Dados pessoais");
    drawParagraph(`Nome: ${personalData.nome}`);
    drawParagraph(`Email: ${personalData.email}`);
    drawParagraph(`WhatsApp: ${personalData.Whatsapp}`);

    drawSectionTitle("Arquétipo dominante");
    drawParagraph(`${dominant.archetype.name} — Pontuação: ${dominant.score}/30 (${dominant.percentage.toFixed(1)}%)`);
    // drawParagraph(`Descrição: ${dominant.archetype.description}`);
    // drawParagraph(`Foco principal: ${dominant.archetype.focus}`);

    drawSectionTitle("Arquétipo secundário");
    drawParagraph(`${secondary.archetype.name} — Pontuação: ${secondary.score}/30 (${secondary.percentage.toFixed(1)}%)`);
    // drawParagraph(`Descrição: ${secondary.archetype.description}`);

    drawSectionTitle("Arquétipo terciário");
    drawParagraph(`${tertiary.archetype.name} — Pontuação: ${tertiary.score}/30 (${tertiary.percentage.toFixed(1)}%)`);
    // drawParagraph(`Descrição: ${tertiary.archetype.description}`);

    drawSectionTitle("Ranking completo");
    scores.forEach((score, index) => {
      ensureSpace(16);
      page.drawText(
        `${index + 1}. ${score.archetype.name} — ${score.score}/30 (${score.percentage.toFixed(1)}%)`,
        { x: margin, y: cursorY, size: 11, font: regularFont, color: rgb(0, 0, 0) }
      );
      cursorY -= 15;
    });


    const pdfBytes = await pdfDoc.save();

    const pdfArrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;


    const blob = await new Response(pdfArrayBuffer, {
      headers: { "Content-Type": "application/pdf" },
    }).blob();




    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = `resultado-arquetipos-${Date.now()}.pdf`;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-foreground">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col items-center sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="w-full text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Seus Resultados
          </h1>
          <p className="text-lg text-muted-foreground">
            Análise completa do seu perfil de arquétipos pessoais
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {personalData.nome}
            </div>
          </div>
        </div>

        {/* Top 3 Arquétipos */}
        <div className="w-full grid gap-8 mb-12">
          {/* Dominante */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
              <div className="h-24 bg-gradient-to-r from-background to-secondary p-6 flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-semibold opacity-90">ARQUÉTIPO DOMINANTE</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {dominant.archetype.name}
                  </h2>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-primary">Descrição:</span> {dominant.archetype.description}
                  </p>
                  <p className="text-muted-foreground mt-4">
                    <span className="font-semibold text-primary">Foco principal:</span> {dominant.archetype.focus}
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Pontuação</span>
                    <span className="text-3xl font-bold text-primary">
                      {dominant.score} <span className="text-lg text-muted-foreground">/ 30</span>
                    </span>
                  </div>

                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                      style={{ width: `${dominant.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">Desenvolvimento</span>
                    <span className="text-lg font-bold text-primary">
                      {dominant.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secundário */}
          <div className="relative">
            <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border border-border">
              <div className="h-16 bg-gradient-to-r from-secondary to-accent p-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{secondary.archetype.name}</h2>
                <span className="text-3xl opacity-30 text-primary-foreground">2º</span>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  {secondary.archetype.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Pontuação</span>
                    <span className="text-2xl font-bold text-secondary">
                      {secondary.score} <span className="text-sm text-muted-foreground">/ 30</span>
                    </span>
                  </div>

                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 rounded-full"
                      style={{ width: `${secondary.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terciário */}
          <div className="relative">
            <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 border border-border">
              <div className="h-14 bg-gradient-to-r from-secondary to-accent p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{tertiary.archetype.name}</h2>
                <span className="text-2xl opacity-30 text-primary-foreground">3º</span>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {tertiary.archetype.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">Pontuação</span>
                  <span className="font-bold text-secondary">
                    {tertiary.score} <span className="text-xs text-muted-foreground">/ 30</span>
                  </span>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 rounded-full"
                    style={{ width: `${tertiary.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="w-full bg-card rounded-lg p-6 mb-12 border-l-4 border-primary shadow-md">
          <div className="flex flex-row items-center gap-1 text-lg font-bold text-foreground mb-4">
            <Mail className=""></Mail>
            <p>Seus Dados Pessoais</p>
          </div>
          <div className="grid gap-3 text-sm">
            <p className="flex justify-between">
              <span className="font-semibold text-muted-foreground">Nome:</span>
              <span className="text-foreground">{personalData.nome}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-muted-foreground">Email:</span>
              <span className="text-foreground">{personalData.email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-muted-foreground">WhatsApp:</span>
              <span className="text-foreground">{personalData.Whatsapp}</span>
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-accent text-primary-foreground font-bold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-0"
          >
            <div className="flex flex-row items-center gap-1">
              <StickyNote></StickyNote>
              Baixar Resultado (PDF)
            </div>
          </Button>

          <Button
            onClick={onRestart}
            className="flex-1 bg-muted text-primary hover:bg-muted/80 font-bold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-2 border-primary"
          >
            <div className="flex flex-row items-center gap-1">
              <RotateCcw></RotateCcw>
              <p>Refazer o Teste</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
