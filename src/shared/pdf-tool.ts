/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { InternalServerErrorException } from "@nestjs/common";
import axios from "axios";
import PDFDocument from "pdfkit-table";

const font = "Helvetica";
const fontBold = "Helvetica-Bold";
const fontColorBlue = "#1B4385";
const fontColorBlack = "#000000";
const titleFontSize = 16;

interface IYaxisSpacing {
  key1: object;
  value1: object;
  key2: object;
  value2: object;
  key3: object;
  value3: object;
}

interface IColumn {
  name: string;
  position: number;
}
export interface ITableRow {
  columnName: string;
  text: string;
  hyperlink?: string;
  columnPosition: number;
  img?: string;
}
interface IPdfConstructor {
  title: string;
  columNames: IColumn[];
  tableRows: { [key: string]: ITableRow[] }[];
  footer: string;
  displayImages?: boolean;
}
const TABLE_OPTIONS = {
  hideHeader: true,
  divider: {
    header: { disabled: true },
    horizontal: { disabled: true },
  },
  x: 20,
};

const ySTART_FOOTER = 750;

export class PdfGenerator {
  private readonly doc: PDFDocument;
  private readonly marginRight = 20;

  private readonly title: string;
  private readonly coloumns: IColumn[];
  private readonly rows: { [key: string]: ITableRow[] }[];
  private readonly footer: string;
  private readonly displayImages: boolean;
  private readonly generalInfoTable: {
    headers: object[];
    data: IYaxisSpacing[];
  } = {
    headers: [
      { label: "key1", property: "key1", width: 2 },
      { label: "value1", property: "value1", width: 180 },
      { label: "key2", property: "key2", width: 8 },
      { label: "value2", property: "value2", width: 70 },
      { label: "key3", property: "key3", width: 8 },
      { label: "value3", property: "value3", width: 70 },
    ],
    data: [],
  };

  constructor({
    title,
    columNames,
    tableRows,
    footer,
    displayImages,
  }: IPdfConstructor) {
    this.doc = new PDFDocument({
      size: "A4",
      margin: 20,
    });
    this.title = title;
    this.coloumns = columNames;
    this.rows = tableRows;
    this.footer = footer;
    this.displayImages = displayImages ?? false;
  }

  async createBuffer(displayPoster = false): Promise<Buffer> {
    try {
      const pdfBuffer: Buffer = await new Promise(async resolve => {
        this.generateHeader();
        await this.writeBody(displayPoster);
        this.generateFooter();
        await this.doc.table(this.generalInfoTable, TABLE_OPTIONS);

        this.doc.end();
        const buffer: Buffer[] = [];
        this.doc.on("data", buffer.push.bind(buffer));
        this.doc.on("end", () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });
      });
      return pdfBuffer;
    } catch (error) {
      console.error(`${JSON.stringify(error, undefined, 2)}`);
      throw new InternalServerErrorException(error);
    }
  }

  async writeBody(): Promise<void> {
    let yAxis = 80;
    const xMargin = 60;
    const textWidth = 80;

    for (const rowId of this.rows) {
      const sortedRow = rowId.id.toSorted((a, b) => {
        return a.columnPosition === b.columnPosition
          ? 0
          : a.columnPosition > b.columnPosition
            ? -1
            : 1;
      });

      let xAxis = 10;
      for (const row of sortedRow) {
        if (row?.img) {
          const url = `${process.env.TMBD_IMG_BASE_URL}${row.img}`;
          const { data } = await axios.get<ArrayBuffer>(url, {
            responseType: "arraybuffer",
          });

          this.doc.image(data, xAxis, yAxis, {
            scale: 0.25,
          });
        } else {
          this.doc
            .fontSize(11)
            .fillColor(fontColorBlack)
            .font(font)
            .text(`${row.text}`, xAxis, yAxis, {
              align: "left",
              width: textWidth * 4,
              ...(row?.hyperlink && { link: row.hyperlink }),
            });
        }
        xAxis += xMargin * 2;
      }
      yAxis += 30;
    }
  }

  generateHeader(): void {
    const yBase = 30;
    const xMargin = 60;
    let xAxis = 10;
    const textWidth = 80;
    const nextLine = yBase * 2;

    this.doc
      .font(fontBold)
      .fillColor(fontColorBlue)
      .fontSize(titleFontSize)
      .text(this.title, this.marginRight, yBase, {
        align: "center",
      })
      .moveDown();

    const sortedColoumns = this.coloumns.toSorted((a, b) => {
      return a.position === b.position ? 0 : a.position > b.position ? -1 : 1;
    });

    for (const coloum of sortedColoumns) {
      this.doc
        .fontSize(11)
        .fillColor(fontColorBlue)
        .font(font)
        .text(`${coloum.name} Titles`, xAxis, nextLine, {
          align: "left",
          width: textWidth,
        });
      xAxis += xMargin * 2;
    }

    /*     this.doc
      .fontSize(11)
      .fillColor(fontColorBlue)
      .font(font)
      .text(`Release `, xAxis, nextLine, {
        align: "center",
        width: textWidth,
      });

    xAxis += xMargin;
    this.doc
      .fontSize(11)
      .fillColor(fontColorBlue)
      .font(font)
      .text(`Votes`, xAxis, nextLine, {
        align: "right",
        width: textWidth,
      }); */
  }

  generateFooter(): void {
    this.doc
      .strokeColor(fontColorBlue)
      .lineWidth(1)
      .moveTo(30, ySTART_FOOTER)
      .lineTo(570, ySTART_FOOTER)
      .stroke();

    this.doc
      .fontSize(11)
      .fillColor(fontColorBlack)
      .font(font)
      .text(this.footer, this.marginRight + 8, ySTART_FOOTER + 10, {
        align: "center",
        width: 550,
      });
  }
}
