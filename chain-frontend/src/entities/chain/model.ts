import { create } from "zustand";
import type { Chain } from "./schema";
import type { Action } from "../action/schema";

const DEFAULT_WAIT_FOR = 60; // Seconds

interface ChainState {
  chains?: Chain[];
  setChains: (chains: Chain[]) => void;
  addChain: (chain: Chain) => void;
  getChain: (id: string) => Chain | null;
  updateChain: (chain: Chain) => void;
  deleteChain: (id: string) => void;
  addCommentAction: (chainId: string, action: Action) => void;
  updateAction: (chainId: string, actionIndex: number, action: Action) => void;
  deleteAction: (chainId: string, actionIndex: number) => void;
  moveActionUp: (chainId: string, actionIndex: number) => void;
  moveActionDown: (chainId: string, actionIndex: number) => void;
}

export const useChainState = create<ChainState>((set, get) => ({
  setChains: (chains) => set({ chains }),

  addChain: (chain) =>
    set((state) => {
      if (!state.chains) return { chains: [chain] };
      return { chains: [...state.chains, chain] };
    }),

  getChain: (id) => {
    const chains = get().chains;
    if (!chains) return null;

    const chain = chains.find((value) => value._id === id);
    if (!chain) return null;

    return chain;
  },

  updateChain: (chain) =>
    set((state) => {
      const chains = state.chains;
      if (!chains) return { chains: [chain] };
      const chainIndex = chains.findIndex((value) => value._id === chain._id);
      if (chainIndex === -1) return { chains: [...chains, chain] };

      return {
        chains: [
          ...chains.slice(0, chainIndex),
          chain,
          ...chains.slice(chainIndex + 1),
        ],
      };
    }),

  deleteChain: (id) =>
    set((state) => {
      const chains = state.chains;
      if (!chains) return state;
      const chainIndex = chains.findIndex((value) => value._id === id);
      if (chainIndex === -1) return state;

      return {
        chains: [
          ...chains.slice(0, chainIndex),
          ...chains.slice(chainIndex + 1),
        ],
      };
    }),

  addCommentAction: (chainId, action) =>
    set((state) => {
      const chains = state.chains;
      if (!chains) return state;

      const chainIndex = chains.findIndex((value) => value._id === chainId);
      if (chainIndex === -1) return state;

      const actions = chains[chainIndex].actions;

      if (typeof actions === "undefined" || actions.length === 0) {
        chains[chainIndex].actions = [action];
        return state;
      }

      const lastAction = actions.at(-1)!;

      if (lastAction.actionType === "comment")
        actions.push({ actionType: "wait", waitFor: DEFAULT_WAIT_FOR });

      actions.push(action);
      chains[chainIndex].actions = actions;
      return state;
    }),

  updateAction: (chainId, actionIndex, action) =>
    set((state) => {
      const chains = state.chains;
      if (!chains) return state;

      const chain = state.getChain(chainId);

      if (
        !chain ||
        typeof chain.actions === "undefined" ||
        !chain.actions[actionIndex]
      )
        return state;

      chain.actions[actionIndex] = action;
      return state;
    }),

  deleteAction: (chainId, actionIndex) =>
    set((state) => {
      const chains = state.chains;
      if (!chains) return state;

      const chain = state.getChain(chainId);
      const chainIndex = chains.findIndex((value) => value._id === chainId);
      if (chainIndex === -1) return state;

      if (
        !chain ||
        typeof chain.actions === "undefined" ||
        !chain.actions[actionIndex]
      )
        return state;

      let newActions = chain.actions
        .slice(0, actionIndex)
        .concat(chain.actions.slice(actionIndex + 1));

      if (newActions[actionIndex]?.actionType === "wait")
        newActions = newActions
          .slice(0, actionIndex)
          .concat(newActions.slice(actionIndex + 1));

      if (newActions.at(-1)?.actionType === "wait") {
        newActions = newActions.slice(0, -1);
      }

      chain.actions = newActions;
      chains[chainIndex] = { ...chain, actions: newActions };
      return state;
    }),

  moveActionUp: (chainId, actionIndex) =>
    set((state) => {
      const chains = state.chains;
      if (!chains) return state;

      const chain = state.getChain(chainId);
      const chainIndex = chains.findIndex((value) => value._id === chainId);
      if (chainIndex === -1) return state;

      if (
        !chain ||
        typeof chain.actions === "undefined" ||
        !chain.actions[actionIndex]
      )
        return state;

      let newActions = [...chain.actions];
      const actionIndexToSwap = actionIndex - 2;

      if (actionIndexToSwap < 0) return state;

      newActions[actionIndexToSwap] = chain.actions[actionIndex];
      newActions[actionIndex] = chain.actions[actionIndexToSwap];

      chain.actions = newActions;
      chains[chainIndex] = { ...chain, actions: newActions };
      return state;
    }),

  moveActionDown: (chainId, actionIndex) =>
    set((state) => {
      const chains = state.chains;
      if (!chains) return state;

      const chain = state.getChain(chainId);
      const chainIndex = chains.findIndex((value) => value._id === chainId);
      if (chainIndex === -1) return state;

      if (
        !chain ||
        typeof chain.actions === "undefined" ||
        !chain.actions[actionIndex]
      )
        return state;

      let newActions = [...chain.actions];
      const actionIndexToSwap = actionIndex + 2;

      if (actionIndexToSwap + 1 > chain.actions.length) return state;

      newActions[actionIndexToSwap] = chain.actions[actionIndex];
      newActions[actionIndex] = chain.actions[actionIndexToSwap];

      chain.actions = newActions;
      chains[chainIndex] = { ...chain, actions: newActions };
      return state;
    }),
}));
