# Crypto Wallet Frontend

A React TypeScript application for interacting with a cryptocurrency wallet service through a GraphQL API.

## Features

- 🔐 **User Authentication** - Register and login functionality
- 💼 **Wallet Management** - Generate new wallets and view balances
- 💸 **Send Funds** - Transfer cryptocurrency to other addresses
- 📊 **Transaction History** - View all wallet transactions
- 📱 **Responsive Design** - Mobile-friendly interface

## Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Apollo Client** - GraphQL client
- **React Router** - Navigation
- **CSS3** - Styling

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Running GraphQL backend server (see wallet-api project)

## Setup Instructions

1. **Clone and navigate to the project**
   ```bash
   cd wallet-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GraphQL endpoint**
   
   Update the GraphQL URI in `src/lib/apollo-client.ts`:
   ```typescript
   const httpLink = createHttpLink({
     uri: 'http://localhost:3000/graphql', // Update this to your backend URL
   });
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/         # React components
│   ├── Auth.css       # Authentication styles
│   ├── Dashboard.css  # Dashboard styles
│   ├── Landing.css    # Landing page styles
│   ├── Dashboard.tsx  # Main wallet dashboard
│   ├── Landing.tsx    # Landing page
│   ├── Login.tsx      # Login component
│   ├── Register.tsx   # Registration component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/          # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/             # Custom React hooks
│   └── useAuth.ts     # Authentication hook
├── lib/               # Utilities and configurations
│   ├── apollo-client.ts # Apollo Client setup
│   └── graphql.ts     # GraphQL queries/mutations
├── types/             # TypeScript type definitions
│   └── index.ts       # Application types
├── App.tsx            # Main application component
├── App.css            # Global styles
└── main.tsx           # Application entry point
```

## GraphQL Operations

The application supports the following GraphQL operations:

### Mutations
- `register` - Create a new user account
- `login` - Authenticate user
- `generateWallet` - Create a new wallet for the user
- `transferFunds` - Send cryptocurrency to another address

### Queries
- `me` - Get current user information
- `getWalletBalance` - Get user's wallet balance
- `getTransactionHistory` - Get user's transaction history
- `getTransaction` - Get specific transaction details
- `getAddressBalance` - Get balance for any address

## Environment Configuration

For production deployment, create a `.env` file:

```env
VITE_GRAPHQL_URL=https://your-api-domain.com/graphql
```

Then update the Apollo Client configuration to use environment variables.

## Security Features

- JWT token-based authentication
- Automatic token refresh handling
- Protected routes requiring authentication
- Secure local storage for user data
- GraphQL error handling and user feedback

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
# wallet-frontend
