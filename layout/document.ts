interface IndexOptions {
  body: string;
  head: Array<string>;
  footer: Array<string>;
  styles: string;
}

export function Document({ body, head, footer, styles }: IndexOptions) {
  return (`
    <!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="styles.css" />
        ${styles}
        ${head.join("\n")}
      </head>
      <body>
        ${body}
        ${footer.join("\n")}
      </body>
    </html>
  `);
}
