import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTerminalDrawerComponent } from './web-terminal-drawer.component';
import { EdsAssetVO } from '../../../../../@core/data/ext-datasource';

describe('WebTerminalDrawerComponent', () => {
  let component: WebTerminalDrawerComponent;
  let fixture: ComponentFixture<WebTerminalDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebTerminalDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebTerminalDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Terminal opened status tracking', () => {
    let mockAsset: EdsAssetVO;

    beforeEach(() => {
      mockAsset = {
        id: 1,
        parentId: 0,
        instanceId: 1,
        name: 'Test Asset',
        assetId: 'test-asset-1',
        assetKey: '192.168.1.1',
        assetType: 'server',
        kind: 'linux',
        version: '1.0',
        region: 'us-east-1',
        zone: 'us-east-1a',
        assetStatus: 'active',
        createdTime: new Date(),
        expiredTime: new Date(),
        description: 'Test asset',
        originalModel: '',
        originalAsset: {},
        toBusiness: {},
        businessTags: [],
        valid: true,
        resourceCount: 0
      } as EdsAssetVO;
    });

    it('should initially show no terminals as opened', () => {
      expect(component.isTerminalOpened(mockAsset)).toBeFalsy();
    });

    it('should mark terminal as opened when asset is clicked', () => {
      // Mock the data object to prevent errors
      component.data = {
        onAssetSelect: jasmine.createSpy('onAssetSelect')
      };

      // Click on asset
      component.onAssetClick(mockAsset);

      // Verify terminal is marked as opened
      expect(component.isTerminalOpened(mockAsset)).toBeTruthy();
    });

    it('should mark multiple terminals as opened in batch select', () => {
      const mockAssets = [
        { 
          ...mockAsset,
          id: 1, 
          name: 'Asset 1', 
          assetKey: '192.168.1.1',
          assetId: 'test-asset-1'
        },
        { 
          ...mockAsset,
          id: 2, 
          name: 'Asset 2', 
          assetKey: '192.168.1.2',
          assetId: 'test-asset-2'
        }
      ] as EdsAssetVO[];

      // Mock datatable and data
      component.data = {
        onAssetSelect: jasmine.createSpy('onAssetSelect')
      };
      
      // Mock datatable getCheckedRows method
      const mockDataTable = {
        getCheckedRows: jasmine.createSpy('getCheckedRows').and.returnValue(mockAssets),
        setTableCheckStatus: jasmine.createSpy('setTableCheckStatus')
      };
      component.datatable = mockDataTable as any;

      // Execute batch select
      component.onBatchSelect();

      // Verify all assets are marked as opened
      mockAssets.forEach(asset => {
        expect(component.isTerminalOpened(asset)).toBeTruthy();
      });
    });

    it('should clear all opened terminals when clearOpenedTerminals is called', () => {
      // Mark some terminals as opened
      component.onAssetClick(mockAsset);
      expect(component.isTerminalOpened(mockAsset)).toBeTruthy();

      // Clear opened terminals
      component.clearOpenedTerminals();

      // Verify terminal is no longer marked as opened
      expect(component.isTerminalOpened(mockAsset)).toBeFalsy();
    });

    it('should use different asset identifiers for tracking', () => {
      const assetWithId = { ...mockAsset, id: 1, name: 'Asset 1' } as EdsAssetVO;
      const assetWithAssetKey = { ...mockAsset, id: 2, assetKey: '192.168.1.1', name: 'Asset 2' } as EdsAssetVO;
      const assetWithNameOnly = { ...mockAsset, id: 3, name: 'Asset 3' } as EdsAssetVO;

      component.data = { onAssetSelect: jasmine.createSpy('onAssetSelect') };

      // Click on different types of assets
      component.onAssetClick(assetWithId);
      component.onAssetClick(assetWithAssetKey);
      component.onAssetClick(assetWithNameOnly);

      // Verify all are tracked correctly
      expect(component.isTerminalOpened(assetWithId)).toBeTruthy();
      expect(component.isTerminalOpened(assetWithAssetKey)).toBeTruthy();
      expect(component.isTerminalOpened(assetWithNameOnly)).toBeTruthy();
    });
  });
});
