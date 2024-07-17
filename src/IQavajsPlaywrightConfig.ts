export interface IQavajsPlaywrightConfig {
  browser?: {
    /**
     * Timeouts configuration
     * Enables flexible configuration of validation timeouts and polling intervals to enhance test robustness.
     */
    timeout?: {
      /**
       * Element presence timeout
       *
       * default: 10_000
       * @example
       * export default {
       *     present: 20_000
       * }
       */
      present?: number,
      /**
       * Element visibility timeout
       *
       * default: 10_000
       * @example
       * export default {
       *     visible: 20_000
       * }
       */
      visible?: number,
      /**
       * Page load timeout
       *
       * default: 10_000
       * @example
       * export default {
       *     page: 20_000
       * }
       */
      page?: number,
      /**
       * Element value timeout
       *
       * default: 5_000
       * @example
       * export default {
       *     value: 10_000
       * }
       */
      value?: number,
      /**
       * Interval for checking a value in polling validations
       *
       * default: 500
       * @example
       * export default {
       *     valueInterval: 1_500
       * }
       */
      valueInterval?: number,
      /**
       * Interval for steps performing actions in loop unless some validation to be met
       *
       * default: 1_000
       * @example
       * export default {
          actionInterval: 2_000,
       * }
       */
      actionInterval?: number,
      /**
       * Interval for steps refreshing page in loop unless some validation to be met
       *
       * default: 2_000
       * @example
       * export default {
       *     pageRefreshInterval: 10_000
       * }
       */
      pageRefreshInterval?: number
    }
  }
}