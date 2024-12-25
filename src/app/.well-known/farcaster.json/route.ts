export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
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
