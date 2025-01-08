import SubscriptionManager from './manager'

declare global {
  // eslint-disable-next-line no-var
  var subscriptionManager: SubscriptionManager
}

export async function initializeSubscriptionManager(): Promise<void> {
  if (!global.subscriptionManager) {
    global.subscriptionManager = await SubscriptionManager.initialize()
  }
}

export const subscriptionManager = global.subscriptionManager
