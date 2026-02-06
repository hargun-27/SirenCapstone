#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridgeModule.h>

@interface AlarmSoundModule : NSObject <RCTBridgeModule>
@end

@implementation AlarmSoundModule {
  AVAudioPlayer *_player;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(play : (NSString *)filename volume : (double)volume) {
  dispatch_async(dispatch_get_main_queue(), ^{
    // Stop any previous playback
    if (self->_player) {
      [self->_player stop];
      self->_player = nil;
    }

    // Configure audio session so sound plays even in silent mode
    NSError *sessionError;
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback
                                           error:&sessionError];
    [[AVAudioSession sharedInstance] setActive:YES error:&sessionError];

    // Locate the sound file in the app bundle (files are at the bundle root)
    NSString *path = [[NSBundle mainBundle] pathForResource:filename
                                                     ofType:@"mp3"];
    if (!path) {
      NSLog(@"AlarmSoundModule: file not found – %@.mp3 in Sounds/", filename);
      return;
    }

    NSURL *url = [NSURL fileURLWithPath:path];
    NSError *error;
    self->_player = [[AVAudioPlayer alloc] initWithContentsOfURL:url
                                                           error:&error];
    if (error) {
      NSLog(@"AlarmSoundModule: error loading sound – %@",
            error.localizedDescription);
      return;
    }

    self->_player.volume = (float)fmax(0.0, fmin(1.0, volume / 100.0));
    self->_player.numberOfLoops = -1; // loop indefinitely
    [self->_player play];
  });
}

RCT_EXPORT_METHOD(stop) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self->_player stop];
    self->_player = nil;
  });
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
