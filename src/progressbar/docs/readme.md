A progress bar directive that is focused on providing feedback on the progress of a workflow or action.

It supports multiple (stacked) bars into the same `progress` element,  optional `max` attribute and transition animations.

### Settings ###

#### `<progress>` ####

 * `max`
 	_(Default: 100)_ :
 	A number that specifies the total value of bars that is required.

 * `animate`
 	_(Default: true)_ :
 	Whether bars use transitions to achieve the width change.

#### `<bar>` ####

 * `value` <i class="icon-eye-open"></i>
 	:
 	The current value of progress completed.

 * `type`
 	_(Default: null)_ :
 	Style type. Possible values are 'success', 'warning' etc.

