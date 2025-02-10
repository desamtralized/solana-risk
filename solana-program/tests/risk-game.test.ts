import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { Keypair, PublicKey } from "@solana/web3.js";
import { RiskGame } from "../target/types/risk_game";

interface Territory {
  owner: PublicKey | null;
  adjacentTerritories: number[];
  troops?: number;
}

interface GameAccount {
  currentPlayer: PublicKey;
  state: { setup: {} } | { inProgress: {} };
  turn: number;
  territories: Territory[];
  players: PublicKey[];
}

describe("risk-game", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const PROGRAM_ID = new PublicKey("G4irLCSNHfxh2eCVpXowciffLtbnwGm1mGXU28afPsPJ");
  const program = new Program<RiskGame>(require("../target/idl/risk_game.json"), PROGRAM_ID, provider);
  
  let gameKeypair: Keypair;
  let player2: Keypair;

  beforeEach(async () => {
    gameKeypair = anchor.web3.Keypair.generate();
    player2 = anchor.web3.Keypair.generate();

    // Airdrop some SOL to player2
    const signature = await provider.connection.requestAirdrop(
      player2.publicKey,
      1000000000
    );
    await provider.connection.confirmTransaction(signature);
  });

  it("Can initialize game", async () => {
    const tx = await program.methods
      .initializeGame()
      .accounts({
        game: gameKeypair.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameKeypair])
      .rpc();

    const gameAccount = await program.account.game.fetch(gameKeypair.publicKey) as GameAccount;
    expect(gameAccount.currentPlayer.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(gameAccount.state).to.deep.equal({ setup: {} });
    expect(gameAccount.turn).to.equal(1);
    expect(gameAccount.territories.length).to.equal(6);
  });

  it("Can join game", async () => {
    // Initialize game
    await program.methods
      .initializeGame()
      .accounts({
        game: gameKeypair.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameKeypair])
      .rpc();

    // Player 2 joins
    await program.methods
      .joinGame()
      .accounts({
        game: gameKeypair.publicKey,
        player: player2.publicKey,
      })
      .signers([player2])
      .rpc();

    const gameAccount = await program.account.game.fetch(gameKeypair.publicKey) as GameAccount;
    expect(gameAccount.players).to.have.length(2);
    expect(gameAccount.state).to.deep.equal({ inProgress: {} });
  });

  it("Can place troops", async () => {
    // Initialize and join game first
    await program.methods
      .initializeGame()
      .accounts({
        game: gameKeypair.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameKeypair])
      .rpc();

    await program.methods
      .joinGame()
      .accounts({
        game: gameKeypair.publicKey,
        player: player2.publicKey,
      })
      .signers([player2])
      .rpc();

    // Get game state to find a territory owned by creator
    const gameAccount = await program.account.game.fetch(gameKeypair.publicKey) as GameAccount;
    const creatorTerritory = gameAccount.territories.findIndex(
      (t: Territory) => t.owner?.toString() === provider.wallet.publicKey.toString()
    );

    // Place troops
    await program.methods
      .placeTroops(creatorTerritory, 5)
      .accounts({
        game: gameKeypair.publicKey,
        player: provider.wallet.publicKey,
      })
      .rpc();

    const updatedGame = await program.account.game.fetch(gameKeypair.publicKey) as GameAccount;
    expect(updatedGame.territories[creatorTerritory].troops).to.equal(8); // 3 initial + 5 placed
  });

  it("Can attack territory", async () => {
    // Initialize and join game first
    await program.methods
      .initializeGame()
      .accounts({
        game: gameKeypair.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameKeypair])
      .rpc();

    await program.methods
      .joinGame()
      .accounts({
        game: gameKeypair.publicKey,
        player: player2.publicKey,
      })
      .signers([player2])
      .rpc();

    // Get game state to find territories for attack
    const gameAccount = await program.account.game.fetch(gameKeypair.publicKey) as GameAccount;
    const fromTerritory = gameAccount.territories.findIndex(
      (t: Territory) => t.owner?.toString() === provider.wallet.publicKey.toString()
    );
    
    // Find an adjacent enemy territory
    const toTerritory = gameAccount.territories[fromTerritory].adjacentTerritories.find(
      (adjId: number) => gameAccount.territories[adjId].owner?.toString() !== provider.wallet.publicKey.toString()
    );

    if (toTerritory === undefined) {
      throw new Error("No adjacent enemy territory found for testing attack");
    }

    // Place more troops first
    await program.methods
      .placeTroops(fromTerritory, 5)
      .accounts({
        game: gameKeypair.publicKey,
        player: provider.wallet.publicKey,
      })
      .rpc();

    // Attack
    await program.methods
      .attackTerritory(fromTerritory, toTerritory, 5)
      .accounts({
        game: gameKeypair.publicKey,
        player: provider.wallet.publicKey,
      })
      .rpc();

    const updatedGame = await program.account.game.fetch(gameKeypair.publicKey) as GameAccount;
    expect(updatedGame.territories[toTerritory].owner?.toString()).to.equal(
      provider.wallet.publicKey.toString()
    );
  });
}); 