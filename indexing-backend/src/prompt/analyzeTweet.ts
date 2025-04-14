export const analyzeTweetPrompt = (tweetText: string) => `
        Analyze the following tweet and determine if it is related to a cryptocurrency presale or Initial Coin Offering (ICO).
        If it is related to a presale/ICO, extract the following details (if available):
        - Project name
        - Ticker/Symbol
        - Wallet address for funds
        - Twitter handle
        - Website
        - Purpose of the project
        - Amount being raised
        - Team details
        - Start date of the presale/ICO
        - End date of the presale/ICO
        - Token price
        
        Return the data in JSON format with these fields:
        - projectName (string or null)
        - tokenTicker (string or null)
        - walletAddress (string or null)
        - twitterHandle (string or null)
        - website (string or null)
        - purpose (string or null)
        - amountRaised (string or null)
        - teamInfo (string or null)
        - startDate (ISO date string or null)
        - endDate (ISO date string or null)
        - price (string or null)
        
        Tweet: "${tweetText}"
        
        Return only the JSON object with no additional text.
      `;