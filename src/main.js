// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import "!style-loader!css-loader!less-loader!./assets/less/global.less";
// 导入字体图标
import "./assets/fonts/iconfont.css";
import treetable from "vue-table-with-tree-grid";

import VueQuillEditor from "vue-quill-editor";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import {
  Button,
  Form,
  FormItem,
  Input,
  Icon,
  Message,
  Container,
  Aside,
  Header,
  Main,
  Avatar,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Carousel,
  CarouselItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Col,
  Row,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Step,
  Steps,
  Tabs,
  TabPane,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem
} from "element-ui";

Vue.use(TimelineItem);
Vue.use(Timeline);
Vue.use(Upload);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Alert);
Vue.use(Cascader);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Col);
Vue.use(Row);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Avatar);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Option);
Vue.use(Select);
Vue.use(VueQuillEditor);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

Vue.directive("focus", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el) {
    // 聚焦元素
    el.focus();
  }
});

Vue.component("tree-table", treetable);

Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
