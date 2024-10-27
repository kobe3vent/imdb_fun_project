import axios from "axios";
import PDFDocument from "pdfkit-table";

import { MovieDTO } from "../modules/movie/dto/movie.dto";

const font = "Helvetica";
const fontBold = "Helvetica-Bold";
const fontColorBlue = "#1B4385";
const fontColorBlack = "#000000";
const titleFontSize = 16;

interface MovieInfoDisplayOnPdf {
  title: string;
  release_date: string;
  vote_average: number;
  hyperLink: string;
}

const QUESTION_STYLE_OPTION = {
  fontSize: 12,
  fontFamily: fontBold,
  color: fontColorBlue,
};

const CLIENT_INFO_STYLE_OPTION = {
  fontSize: 12,
  fontFamily: font,
  color: fontColorBlack,
};

const yAxisRowSpacing = {
  key1: { label: " " },
  value1: {
    label: "",
  },
  key2: { label: "" },
  value2: {
    label: "",
  },
  key3: { label: "" },
  value3: {
    label: "",
  },
};

const TABLE_OPTIONS = {
  hideHeader: true,
  divider: {
    header: { disabled: true },
    horizontal: { disabled: true },
  },
  x: 20,
};

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

const ySTART_FOOTER = 750;

export class PdfGenerator {
  private doc = new PDFDocument({
    size: "A4",
    margin: 20,
  });
  private marginRight = 20;

  public filename: string;
  private apiResponse: MovieDTO[];
  private generalInfoTable = {
    headers: [
      { label: "key1", property: "key1", width: 2 },
      { label: "value1", property: "value1", width: 180 },
      { label: "key2", property: "key2", width: 8 },
      { label: "value2", property: "value2", width: 70 },
      { label: "key3", property: "key3", width: 8 },
      { label: "value3", property: "value3", width: 70 },
    ],
    datas: [],
  };

  constructor(apiResponse: MovieDTO[]) {
    this.apiResponse = apiResponse;
    this.filename = `movies_${new Date().toString()}.pdf`;
  }

  async createBuffer(displayPoster = false): Promise<Buffer> {
    try {
      const pdfBuffer: Buffer = await new Promise(async resolve => {
        this.generateHeader();
        this.generateGeneralInformation();
        await this.writeBody(this.apiResponse, displayPoster);
        this.generateFooter();
        await this.doc.table(this.generalInfoTable, TABLE_OPTIONS);

        this.doc.end();
        const buffer = [];
        this.doc.on("data", buffer.push.bind(buffer));
        this.doc.on("end", () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });
      });
      return pdfBuffer;
    } catch (error) {
      console.log(`${JSON.stringify(error, null, 2)}`);
      throw new BadRequestException(error);
    }
  }

  async writeBody(array: MovieDTO[], displayPoster: boolean): void {
    let yAxis = 80;
    const xMargin = 60;
    for (const movie of array) {
      let xAxis = 10;
      this.doc
        .fontSize(11)
        .fillColor(fontColorBlack)
        .font(font)
        .text(`${movie.title}`, xAxis, yAxis, {
          align: "left",
          width: 200,
          link: `http://${process.env.APP_HOST}:${process.env.PORT}/movie/${movie.id}`,
        });
      xAxis += xMargin * 3;
      this.doc
        .fontSize(11)
        .fillColor(fontColorBlack)
        .font(font)
        .text(`${movie.release_date}`, xAxis, yAxis, {
          align: "center",
          width: 80,
        });

      xAxis += xMargin;
      this.doc
        .fontSize(11)
        .fillColor(fontColorBlack)
        .font(font)
        .text(`${movie.vote_average}`, xAxis, yAxis, {
          align: "right",
          width: 80,
        });

      if (movie?.poster_path && displayPoster) {
        const url = `${IMG_BASE_URL}${movie.poster_path}`;
        const { data } = await axios.get(url, {
          responseType: "arraybuffer",
        });

        xAxis += xMargin * 2;
        this.doc.image(data, xAxis, yAxis, {
          scale: 0.25,
        });
      }
      yAxis += 30;
    }
  }

  generateHeader(): void {
    const yBase = 30;
    this.doc
      .font(fontBold)
      .fillColor(fontColorBlue)
      .fontSize(titleFontSize)
      .text("IMBD Movie List", this.marginRight, yBase, {
        align: "center",
      })
      .moveDown();
  }

  generateGeneralInformation(): void {
    this.generalInfoTable.datas.push(
      yAxisRowSpacing,
      yAxisRowSpacing,
      yAxisRowSpacing,
      /*       {
        key1: { label: "", options: QUESTION_STYLE_OPTION },
        value1: {
          label: `Page ${this.apiResponse.page}`,
          options: CLIENT_INFO_STYLE_OPTION,
        },
        key2: {
          label: "",
          options: QUESTION_STYLE_OPTION,
        },
        value2: {
          label: `Total pages ${this.apiResponse.total_pages}`,
          options: CLIENT_INFO_STYLE_OPTION,
        },
        key3: { label: "", options: QUESTION_STYLE_OPTION },
        value3: {
          label: `Total Movies: ${this.apiResponse.total_results}`,
          options: CLIENT_INFO_STYLE_OPTION,
        },
      }, */
    );
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
      .text(`movies movies`, this.marginRight + 8, ySTART_FOOTER + 10, {
        align: "center",
        width: 550,
        link: "https://google.com",
      });
  }
}
