export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjc2NTcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg2NDQzZWQ4YTNmZkIwMDZFM0JiNWE4NjZiQUU2ZURGYjkzZjhGRjNFIn0",
      payload: "eyJkb21haW4iOiJmYXJjYXN0ZXItd3JhcHBlZC0yMDI0LnRoaXJkd2ViLXByZXZpZXcuY29tIn0",
      signature: "MHgwY2IyYmY5ZDQ5MTNhZmM1YjhlMTljYWEyNTJlNjVmNThkNDI1MzhlYjAzMmNlMjUzMDhiODgyMDcxNmI5MDVlNTRmNjYxNGZmNGZhZGFjZWQxN2IyYjM2MjYwZjJhMDAxMGY3ZDE4Mzk4N2E5YzRlYjA2OTNmZGY1MTQ5NjZlZTFj"
    },
    frame: {
      version: "1",
      name: "Your Year Onchain",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frame.png`,
      buttonTitle: "See Yours",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#000000"
    },
  };

  return Response.json(config);
}
