#import <UIKit/UIKit.h>
#import <React/RCTRefreshControl.h>

@interface RHCustomScrollView : UIScrollView

- (void)setCustomRefreshControl:(UIView<RCTCustomRefreshContolProtocol> *)refreshControl;

@property (nonatomic, strong) UIView<RCTCustomRefreshContolProtocol> *customRefreshControl;

@end
