import {Guid} from "../util/GUID";
/**
 * Created by wahmed on 4/25/2018.
 */

/**
 * Interface for clients that listen to uObserver
 */
export interface uListener{

  /**
   * Implement this method to use the data passed by the subscribed event
   * @param data
   */
  onNotify(data: any);
}


/**
 * Allows clients to wait for an event to occur without using observables.
 */
export class uObserver{

  //private subscribers : uListener[] = [];
  private subscribers : [string, uListener][] = [];

  /**
   * Adds given class ot the list of subscribers and returns the subscription-id that can be used to un-subscribe.
   * @param T - class that needs to listen to the event, must implement uListener interface
   * @returns {string} subscription id
   */
  subscribe(T: uListener) : string{

    let newGUID = new Guid().newGuid();
    this.subscribers.push([newGUID,T]);
    return newGUID;
  }

  /**
   * To be called by the class that emit the event at the time of notification
   * @param data - any data that clients may use in the onNotify method.
   */
  notify(data: any){
    this.subscribers.forEach(subscriber=>{
      subscriber[1].onNotify(data);
    });
  }

  /**
   * Removes given class from the subscibers list
   * @param index
   */
  unsubscribe(subscriberId: string){
    let index = this.subscribers.findIndex( subscriber=> subscriber[0] == subscriberId )
    this.subscribers.splice(index, 1);
  }
}
