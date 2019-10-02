doUserTask
{
while(true)
{
	speaker0.setTune(F_DO_6, __melodyVolume);
	sleep(500);
	speaker0.setTune(F_MI_6, __melodyVolume);
	sleep(500);
	speaker0.setTune(F_SOL_6, __melodyVolume);
	sleep(500);
	speaker0.setTune(F_DO_7, __melodyVolume);
	sleep(__melodyVolume0);
	speaker0.setTune(F_DO_7, 0);
	sleep(1000);
	}
}