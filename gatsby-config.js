module.exports = {
  pathPrefix: `/tech-radar`,
  siteMetadata: {
    title: 'Flow | Tech Radar',
    siteUrl: 'https://flowcommerce.github.io/tech-radar/',
    description: 'Insights into the technology and trends shaping Flow',
  },
  plugins: [
    `gatsby-plugin-sass`,
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Flow | Tech Radar',
        short_name: 'radar',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/technologies`,
        name: "markdown-pages",
      },
    },
    `gatsby-transformer-remark`,
    'gatsby-plugin-offline',
  ],
}
