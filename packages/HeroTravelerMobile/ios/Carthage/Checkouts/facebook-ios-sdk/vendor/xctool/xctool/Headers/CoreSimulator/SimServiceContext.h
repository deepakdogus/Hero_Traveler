//
//     Generated by class-dump 3.5 (64 bit) (Debug version compiled Jul 15 2015 15:54:55).
//
//     class-dump is Copyright (C) 1997-1998, 2000-2001, 2004-2015 by Steve Nygard.
//

@class NSArray, NSDate, NSDictionary, NSMutableArray, NSMutableDictionary, NSString, SimProfilesPathMonitor;
@protocol OS_dispatch_queue, OS_xpc_object;

@interface SimServiceContext : NSObject
{
    NSMutableArray *_supportedDeviceTypes;
    NSMutableDictionary *_supportedDeviceTypesByIdentifier;
    NSMutableDictionary *_supportedDeviceTypesByAlias;
    NSMutableArray *_supportedRuntimes;
    NSMutableDictionary *_supportedRuntimesByIdentifier;
    NSMutableDictionary *_supportedRuntimesByAlias;
    NSString *_developerDir;
    NSMutableDictionary *_allDeviceSets;
    BOOL _initialized;
    long long _connectionType;
    NSObject<OS_xpc_object> *_serviceConnection;
    NSObject<OS_dispatch_queue> *_serviceConnectionQueue;
    NSDate *_lastConnectionTime;
    SimProfilesPathMonitor *_profileMonitor;
    NSObject<OS_dispatch_queue> *_profileQueue;
    NSObject<OS_dispatch_queue> *_allDeviceSetsQueue;
}

@property(retain, nonatomic) NSObject<OS_dispatch_queue> *allDeviceSetsQueue;
@property(readonly, nonatomic) NSArray *bundledDeviceTypes;
@property(readonly, nonatomic) NSArray *bundledRuntimes;
@property(nonatomic) long long connectionType;
@property(copy, nonatomic) NSString *developerDir;
@property(nonatomic) BOOL initialized;
@property(retain, nonatomic) NSDate *lastConnectionTime;
@property(retain, nonatomic) SimProfilesPathMonitor *profileMonitor;
@property(retain, nonatomic) NSObject<OS_dispatch_queue> *profileQueue;
@property(retain, nonatomic) NSObject<OS_xpc_object> *serviceConnection;
@property(retain, nonatomic) NSObject<OS_dispatch_queue> *serviceConnectionQueue;
@property(readonly, nonatomic) NSArray *supportedDeviceTypes;
@property(readonly, nonatomic) NSDictionary *supportedDeviceTypesByAlias;
@property(readonly, nonatomic) NSDictionary *supportedDeviceTypesByIdentifier;
@property(readonly, nonatomic) NSArray *supportedRuntimes;
@property(readonly, nonatomic) NSDictionary *supportedRuntimesByAlias;
@property(readonly, nonatomic) NSDictionary *supportedRuntimesByIdentifier;

+ (void)setSharedContextConnectionType:(long long)arg1;

+ (id)serviceContextForDeveloperDir:(id)arg1 connectionType:(long long)arg2 error:(id *)arg3;
+ (id)sharedServiceContextForDeveloperDir:(id)arg1 error:(id *)arg2;

- (id)initWithDeveloperDir:(id)arg1 connectionType:(long long)arg2;

- (void)addProfilesAtPath:(id)arg1;
- (void)addProfilesForDeveloperDir:(id)arg1;
- (id)allDeviceSets;
- (void)connect;
- (id)defaultDeviceSetWithError:(id *)arg1;
- (id)deviceSetWithPath:(id)arg1 error:(id *)arg2;
- (void)handleReconnectionBookkeeping;
- (void)handleXPCEvent:(id)arg1;
- (void)serviceAddProfilesAtPath:(id)arg1;
- (void)supportedDeviceTypesAddProfilesAtPath:(id)arg1;
- (void)supportedRuntimesAddProfilesAtPath:(id)arg1;

@end