# Change Log - @uifabric/dashboard

This log was last generated on Thu, 29 Nov 2018 19:34:12 GMT and should not be manually modified.

## 0.36.0
Thu, 29 Nov 2018 19:34:12 GMT

### Minor changes

- RecommendationBanner improvements to support Visualizations and ImageIllustration by default

## 0.35.1
Tue, 20 Nov 2018 20:12:42 GMT

### Patches

- add default fonts from fabric  for dashboard package 

## 0.35.0
Tue, 13 Nov 2018 13:30:53 GMT

### Minor changes

- Adding SetupCard and SetupCardBanner.

## 0.34.0
Fri, 09 Nov 2018 13:32:57 GMT

### Minor changes

- Adding props for card to send props to dataviz in charting package

## 0.33.2
Thu, 08 Nov 2018 04:17:34 GMT

### Patches

- Fixes #5849: get rid of explicit loader syntax inside component file
- Updating context menu shadow styling for card frame and action bar

## 0.33.0
Tue, 06 Nov 2018 13:31:09 GMT

### Minor changes

- Fixing change in hover card behavior, this change in behavior was caused due  to fabric version update in dashbaord package by fabric bot

## 0.32.2
Sun, 04 Nov 2018 02:27:52 GMT

### Patches

- Adding necessary wrapper classes for charting in dashboard package

## 0.32.1
Fri, 02 Nov 2018 18:11:37 GMT

*Version update only*

## 0.32.0
Fri, 02 Nov 2018 12:28:54 GMT

### Minor changes

- Making changes to layout of card to support scaling of dataviz. Dataviz scale as per the parent element they sit in and in this case the parent element is formed using flex css. Added constraints to check if part of card will have dataviz and changes styles accordingly

### Patches

- css changes in card components
- render animations for card charts

## 0.31.1
Wed, 31 Oct 2018 22:35:10 GMT

### Patches

- Add opitional switch for Dashboard Chart -- stack bar chart to not apply default style while data points count is less two

## 0.31.0
Thu, 25 Oct 2018 12:30:05 GMT

### Minor changes

- Adding support when there is no data for line chart, removing unwanted div's that is not letting flex do it job

## 0.30.3
Tue, 23 Oct 2018 12:32:16 GMT

### Patches

- Fix an issue with the demo site not being able to load (in npm start or aka.ms/fabricdemo).

## 0.30.2
Mon, 22 Oct 2018 12:29:57 GMT

### Patches

- "Dashboard/Nav component - added focus style to support keyboard inputs"

## 0.30.1
Thu, 18 Oct 2018 20:22:36 GMT

### Patches

- Remove api-extractor.disabled.json

## 0.30.0
Tue, 16 Oct 2018 12:28:48 GMT

### Minor changes

- Adding support for different date formats to line chart in dashboard card. Calculating datapoints to render a line chart with evenly spaced ticks. Updated examples for cards

## 0.29.3
Mon, 15 Oct 2018 12:29:12 GMT

### Patches

- updating dashboard package
- Styling for marginLeft in Nav

## 0.29.2
Mon, 08 Oct 2018 12:24:15 GMT

### Patches

- Moving tslint/prettier dependencies 

## 0.29.1
Fri, 05 Oct 2018 12:27:02 GMT

### Patches

- removed the line inbetween the grid rows

## 0.29.0
Thu, 04 Oct 2018 12:26:48 GMT

### Minor changes

- Adding common href for the entire multicount component. Removing href that was in before  that allowed passing href to every row seperately

## 0.28.1
Wed, 03 Oct 2018 12:28:46 GMT

*Version update only*

## 0.28.0
Tue, 02 Oct 2018 12:28:04 GMT

### Minor changes

- Adding callback upon clicking on the card title. This can be used in cases like if clicks needs to be instrumented.
- Add setup banner component for dashboard

## 0.27.0
Mon, 01 Oct 2018 12:27:24 GMT

### Minor changes

- clean up not used code
- improve the logic to determin first section

### Patches

- Fix transient dependency on react-resizable
- resolved hover issue of thumbnailList 

## 0.26.2
Thu, 27 Sep 2018 12:27:48 GMT

*Version update only*

## 0.26.1
Wed, 26 Sep 2018 16:58:51 GMT

### Patches

- card content overflow issue fix

## 0.26.0
Wed, 26 Sep 2018 12:27:23 GMT

### Minor changes

- Adding props that take bolding for the content in each cell of gridlist

## 0.25.6
Tue, 25 Sep 2018 12:28:12 GMT

### Patches

- Bug fix: Multicount component body text is not rendered in IE when put inside a flex box with justifyContent of center

## 0.25.5
Mon, 24 Sep 2018 12:27:31 GMT

### Patches

- change lineHeight for card headerText

## 0.25.4
Fri, 21 Sep 2018 14:25:46 GMT

### Patches

- Adding a version stamp file
- Remove drag on menu button on card frame and link button 

## 0.25.3
Thu, 20 Sep 2018 12:25:33 GMT

### Patches

- Add target for cardHeader title in dashboard package

## 0.25.2
Mon, 17 Sep 2018 12:27:05 GMT

### Patches

- fix leftNav styles per PM feedback
- revert the change for expand behavior
- fix the issue where user click on show more link in floating nav

## 0.25.1
Fri, 14 Sep 2018 19:19:00 GMT

### Patches

- Update recommendation centerDataVisualization flex layout css
- Update section title font color

## 0.25.0
Fri, 14 Sep 2018 17:03:00 GMT

### Minor changes

- Changing css for card header. Added tooltip to card header. Disabling icon in hovercard in Multicount component upon passing prop
- Update recommendation component to support data visualization component center align layout

## 0.24.1
Fri, 14 Sep 2018 01:55:02 GMT

### Patches

- Changing styling of wrapper component in card. This wrapper component covers all the charts inside the card content layout.

## 0.24.0
Thu, 13 Sep 2018 17:38:04 GMT

### Minor changes

- expose the card size mapping prop

### Patches

- Changing overflow behaviour of multicount component
- add tslib as a dependency in dashboard
- Enable auto adjust dashboard card header textdashboard card header text

## 0.23.0
Wed, 12 Sep 2018 12:26:41 GMT

### Minor changes

- Adding prop that disables the icon in each row of Multicount. Changing styles if iconHide prop is set to true.

### Patches

- Add fixed size for donut chart in dashboard package
- bug fixes for card components

## 0.22.2
Tue, 11 Sep 2018 02:54:40 GMT

### Patches

- handled the css issues for line chart

## 0.22.1
Mon, 10 Sep 2018 10:24:57 GMT

### Patches

- Update Recommendation card header text font size/line height settings

## 0.22.0
Fri, 07 Sep 2018 22:04:50 GMT

### Minor changes

- create base class for dashboard layout 
- Adding necessary override styles to scale hovercard size as per content. Introducing time delay without which override is not possible.  This is temporary solution suggested by Fabric folks until they fix the bug in hovercard component.

### Patches

- updating card title line height
- Changing color of card title upon hover and active state
- ContentArea is croped in Edge browser

## 0.21.0
Fri, 07 Sep 2018 16:29:48 GMT

### Minor changes

- allow dashboard section control to take JSX elements as child member
- add save prop to edit sections control

### Patches

- fix example for horizontalBarChart

## 0.20.0
Thu, 06 Sep 2018 10:28:35 GMT

### Minor changes

- add export
- changing fabric icons to SVG's.

### Patches

- gird list text overflow css issue 
- patch
- Fix content area clipping in card because of overflow set to hidden
- merge donut and piechart and added in dashboard package

## 0.19.0
Wed, 05 Sep 2018 10:29:25 GMT

### Minor changes

- Adding hover behaviour for Multicount component and onClick listener on each row of the Multicount component

### Patches

- css issues for card
- Added 19px lineHeight to card header text
- fix leftNav styles per PM feedback
- revert the change for expand behavior
- Update Recommendation Header text resize mechanism and description text line height

## 0.18.0
Tue, 04 Sep 2018 10:27:15 GMT

### Minor changes

- Add edit section common control and examples

## 0.17.6
Fri, 31 Aug 2018 20:48:42 GMT

### Patches

- Removed hover effect from dashboard card title when dragging is disabled

## 0.17.5
Fri, 31 Aug 2018 17:27:00 GMT

### Patches

- css issues for card
- change datapoints for line chart

## 0.17.4
Fri, 31 Aug 2018 10:27:35 GMT

### Patches

- Fixes the usage of renamed variable
- change datapoint for horizontal bar chart 

## 0.17.3
Thu, 30 Aug 2018 19:26:04 GMT

### Patches

- fix leftNav styles per PM feedback
- revert the change for expand behavior

## 0.17.2
Thu, 30 Aug 2018 10:32:49 GMT

### Patches

- Add Donut chart with legends

## 0.17.1
Tue, 28 Aug 2018 10:23:58 GMT

### Patches

- css fixes for card component in dashboard package

## 0.17.0
Fri, 24 Aug 2018 10:26:08 GMT

### Minor changes

- Making changes to dashboard card component to consume stacked bar chart with new data point.

## 0.16.0
Thu, 23 Aug 2018 18:39:08 GMT

### Minor changes

- Add an example dashboard with collasable sections.

### Patches

- Rolling back primary action funtionality of action bar

## 0.15.8
Thu, 23 Aug 2018 10:28:17 GMT

### Patches

- font changes for card components
- header css fix
- fix leftNav styles per PM feedback
- revert the change for expand behavior

## 0.15.7
Wed, 22 Aug 2018 05:10:19 GMT

### Patches

- css fixes for card

## 0.15.6
Tue, 21 Aug 2018 20:36:27 GMT

### Patches

- fix leftNav styles per PM feedback

## 0.15.5
Mon, 20 Aug 2018 10:26:10 GMT

### Patches

- Replaced the OverflowSet with IconButton and removed the paddingBottom css in ThumbnailList added the  marign Bottom css.
- minor css changes to body text and recommendation styles

## 0.15.4
Fri, 17 Aug 2018 10:26:39 GMT

### Patches

- ThumbnailList click target size issue fix

## 0.15.3
Thu, 16 Aug 2018 10:26:16 GMT

### Patches

- Various styling fixes for Dashboard cards
- update leftNav style change
- fix leftNav styling bugs
- patch leftNav styling per PM feedback

## 0.15.2
Wed, 15 Aug 2018 10:26:31 GMT

### Patches

- Changing font for components in card

## 0.15.1
Tue, 14 Aug 2018 10:27:33 GMT

### Patches

- disabling codepen task

## 0.15.0
Tue, 14 Aug 2018 00:01:11 GMT

### Minor changes

- Implement new design for StackedBarChart, New components MultiStackedBarChart and Legend. Update Card component to render new components

## 0.14.1
Mon, 13 Aug 2018 03:43:25 GMT

### Patches

- update leftNav style change
- fix leftNav styling bugs

## 0.14.0
Fri, 10 Aug 2018 10:26:08 GMT

### Minor changes

- Fix dashboard card height to match red lines

### Patches

- update leftNav style change

## 0.13.0
Wed, 08 Aug 2018 10:25:07 GMT

### Minor changes

- Adding multiple line chart to charting package. Consuming the multiple line chart in the dashboard Card.

### Patches

- Fix bad imports that break AMD.
- Update Auto-FontSize package to 1.0.9

## 0.12.0
Tue, 07 Aug 2018 10:22:32 GMT

### Minor changes

- Adding props that take colors for icon and content in each cell of gridlist

## 0.11.0
Mon, 06 Aug 2018 10:27:53 GMT

### Minor changes

- passing down card width and height down to charts

### Patches

- Fixing the type of onLayoutChange to fix build

## 0.10.0
Fri, 03 Aug 2018 10:25:59 GMT

### Minor changes

- Adding custom font size and color props to Multicount. Changes to the precision logic

### Patches

- Integrate Auto-FontSize to Recommendation Card header text
- Updated package.json to use react and react-dom in peer dependencies

## 0.9.0
Thu, 02 Aug 2018 10:23:19 GMT

### Minor changes

- Consuming donut,pie,stacked bar chart and mulicount into card.

### Patches

- Adding auto-fontsize dependency.

## 0.8.0
Wed, 01 Aug 2018 10:25:51 GMT

### Minor changes

- Multicount dataviz containing body text and annotation text

## 0.7.1
Tue, 31 Jul 2018 10:25:18 GMT

### Patches

- Fix bad import.

## 0.7.0
Wed, 25 Jul 2018 03:20:34 GMT

### Minor changes

- Fix dashboard package webpack issue

## 0.6.1
Tue, 24 Jul 2018 10:24:36 GMT

*Version update only*

## 0.6.0
Mon, 23 Jul 2018 10:28:08 GMT

### Minor changes

- Added disable drag prop to card to allow recommendation card to be non draggable
- Addressing bad imports.

## 0.5.0
Fri, 20 Jul 2018 10:25:21 GMT

### Minor changes

- Brought in drag api for dashboard grid layout, which enables adding elements from outside the grid into the grid layout

## 0.4.5
Thu, 19 Jul 2018 21:25:32 GMT

*Version update only*

## 0.4.4
Thu, 19 Jul 2018 19:04:38 GMT

*Version update only*

## 0.4.3
Thu, 19 Jul 2018 10:23:34 GMT

*Version update only*

## 0.4.2
Wed, 18 Jul 2018 10:25:50 GMT

*Version update only*

## 0.4.1
Tue, 17 Jul 2018 10:28:40 GMT

*Version update only*

## 0.4.0
Mon, 16 Jul 2018 10:27:18 GMT

### Minor changes

- DGL card shadow, card title href and styling fixes

## 0.3.0
Fri, 13 Jul 2018 21:32:37 GMT

### Minor changes

- Created new package dashboard and moved Recommendation, card and nav to it 

## 0.2.0
Tue, 03 Jul 2018 17:41:15 GMT

### Minor changes

- Fixing loading of css stylesheets from rgl using style-loader

## 0.1.1
Fri, 29 Jun 2018 10:24:05 GMT

### Patches

- Fixed the style loading in dashboard grid layout
- Initial publish.

## 0.1.0
Thu, 21 Jun 2018 19:27:25 GMT

*Initial release*

