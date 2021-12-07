interface IndexOptions {
  body: string;
  head: Array<string>;
  footer: Array<string>;
}

export function Index({ body, head, footer }: IndexOptions) {
  return (`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" />
        ${head.join("\n")}
      </head>
      <body class="bg-gray-800 text-gray-300">
        ${body}
        ${footer.join("\n")}
      </body>
    </html>
  `);
}
