doUserTask
{
while(true)
{
	speaker0.setTune(F_MI_7, __melodyVolume);
	sleep(50);
	speaker0.setTune(F_DO_6, 0);
	sleep(50);
	speaker0.setTune(F_MI_7, __melodyVolume);
	sleep(50);
	speaker0.setTune(F_DO_6, 0);
	sleep(1000);
	}
}