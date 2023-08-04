# 资产管理

### 新增页面：

路由 `src\router\production.js`

开发环境菜单 `src\config\config.devMenu.js`

### 2.2.23生产化版本  2023-06-19

界面优化30条（有道云笔记） https://note.youdao.com/ynoteshare/index.html?id=0a72e6ccde0fa2241e9bdab9123a1cfb&type=note&_time=1685955081857

16、列表搜索栏无清空重置按钮，建议补上（报表管理里的重置都已加完）



|       |                                                              |                                                              |
| :---: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  ID   |                                                              |                           需求名称                           |
| 26147 |                             后端                             | [【资产初始化提效】简化权证导入模板，必填字段很多客户用得少](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26147&onlybody=yes) |
| 26428 |                                                              | [【资产管理】界面优化30条中1-10条](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26428&onlybody=yes) |
| 26516 |                          单独建版本                          | [资产使用方向自定义改造剩余页面改造](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26516&onlybody=yes) |
| 26667 |                              √                               | [【资产变更】优化资产变更单添加资产时只显示正常状态资产](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26667&onlybody=yes) |
| 26668 |                              √                               | [【楼盘字典】房间信息默认展示状态改为有效状态](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26668&onlybody=yes) |
| 26739 |                                                              | [【资产管理】界面优化30条中11-20条](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26739&onlybody=yes) |
| 26957 | /ams/houseStatusSetting/querySettingByOrganId<br />走的这个接口配置  beta是好的 | [【saas】广东省建工控股——资产台账-房屋资产视图字段优化](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26957&onlybody=yes) |
| 26998 |                              √                               | [【saas】广东建工——资产登记，新增时字段与模板下载字段不一致优化](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=26998&onlybody=yes) |
| 27503 |                         √    V2.2.24                         | [【中电】【客户一部】资产视图中新增“产权地址”字段，且该字段取自权证管理中的“坐落位置”](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=27503&onlybody=yes) |
| 27571 |                         √    V2.2.24                         | [【saas】广东建工—资产地图字段优化](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=27571&onlybody=yes) |
| 27963 |                              √                               | [【中电信息】资产信息新增字段](https://pm.uhomecp.com/index.php?m=story&f=view&storyID=27963&onlybody=yes) |

ALTER TABLE `ams`.`ams_asset_house`  
 ADD COLUMN `is_land_sell` VARCHAR(4) NULL COMMENT '是否缴纳土地出让金' AFTER `e_data_id`,
 ADD COLUMN `is_right_clear` VARCHAR(4) NULL  COMMENT '权属是否清晰' AFTER `is_land_sell`,
 ADD COLUMN `right_clear_reason` VARCHAR(250) NULL  COMMENT '权属不清晰原因' AFTER `is_right_clear`,
 ADD COLUMN `is_account_out` VARCHAR(2) NULL  COMMENT '是否账外资产' AFTER `right_clear_reason`,
 ADD COLUMN `belong_to_park` VARCHAR(32) NULL  COMMENT '所属园区' AFTER `is_account_out`,
 ADD COLUMN `asset_reason` VARCHAR(32) NULL  COMMENT '产生或有资产原因' AFTER `belong_to_park`,
 ADD COLUMN `get_asset_date` DATETIME NULL  COMMENT '或有资产取得时间' AFTER `asset_reason`,
 ADD COLUMN `confirm_asset_date` DATETIME NULL  COMMENT '预计转确认资产时间' AFTER `get_asset_date`,
 ADD COLUMN `is_invest_asset` VARCHAR(2) NULL  COMMENT '是否投资性房地产' AFTER `confirm_asset_date`,
 ADD COLUMN `is_idle` VARCHAR(2) NULL  COMMENT '是否闲置' AFTER `is_invest_asset`,
 ADD COLUMN `is_usetype_consistent` VARCHAR(2) NULL  COMMENT '实际用途与证载用途是否一致' AFTER `is_idle`;



ALTER TABLE `ams`.`ams_asset_land`  
 ADD COLUMN `is_right_clear` VARCHAR(4) NULL  COMMENT '权属是否清晰' AFTER `is_land_sell`,
 ADD COLUMN `right_clear_reason` VARCHAR(250) NULL  COMMENT '权属不清晰原因' AFTER `is_right_clear`,
 ADD COLUMN `is_account_out` VARCHAR(2) NULL  COMMENT '是否账外资产' AFTER `right_clear_reason`,
 ADD COLUMN `belong_to_park` VARCHAR(32) NULL  COMMENT '所属园区' AFTER `is_account_out`,
 ADD COLUMN `asset_reason` VARCHAR(32) NULL  COMMENT '产生或有资产原因' AFTER `belong_to_park`,
 ADD COLUMN `get_asset_date` DATETIME NULL  COMMENT '或有资产取得时间' AFTER `asset_reason`,
 ADD COLUMN `confirm_asset_date` DATETIME NULL  COMMENT '预计转确认资产时间' AFTER `get_asset_date`,
 ADD COLUMN `use_nature` VARCHAR(32) NULL  COMMENT '土地使用性质' AFTER `confirm_asset_date`,
 ADD COLUMN `use_utilize` VARCHAR(32) NULL  COMMENT '土地利用情况' AFTER `use_nature`,
 ADD COLUMN `use_condition` VARCHAR(32) NULL  COMMENT '土地使用状况' AFTER `use_utilize`;