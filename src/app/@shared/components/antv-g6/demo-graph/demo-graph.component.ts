import { Component, OnInit } from '@angular/core';
import G6 from '@antv/g6';

@Component({
  selector: 'app-demo-graph',
  templateUrl: './demo-graph.component.html',
  styleUrls: [ './demo-graph.component.less' ],
})
export class DemoGraphComponent implements OnInit {

  /**
   * @see <a href="https://g6.antv.antgroup.com/manual/tutorial/example">g6 文档</a>
   */
  data = {
    // 点集
    nodes: [
      {
        id: 'node1', // String，该节点存在则必须，节点的唯一标识
        x: 100, // Number，可选，节点位置的 x 值
        y: 200, // Number，可选，节点位置的 y 值
        label: '起始点',
      },
      {
        id: 'node2', // String，该节点存在则必须，节点的唯一标识
        x: 300, // Number，可选，节点位置的 x 值
        y: 200, // Number，可选，节点位置的 y 值
        label: '目标点',
      },
    ],
    // 边集
    edges: [
      {
        source: 'node1', // String，必须，起始点 id
        target: 'node2', // String，必须，目标点 id
        label: '我是连线', // 边的文本
      },
    ],
  };

  ngOnInit(): void {
    const graph = new G6.Graph({
      container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 1800, // Number，必须，图的宽度
      height: 1500, // Number，必须，图的高度
      fitView: true, // 设置是否将图适配到画布中；
      fitViewPadding: [ 20, 40, 50, 20 ], // 画布上四周的留白宽度。
    });
    // graph.data(this.data); // 读取 Step 2 中的数据源到图上
    // graph.render();

    const main = async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json',
      );
      const remoteData = await response.json();

      // ...
      graph.data(remoteData); // 加载远程数据
      graph.render(); // 渲染
    };
    main();
  }
}
